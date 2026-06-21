<script lang="ts">
import { tick } from "svelte";

type ChatContact = {
	user_id: number;
	name?: string;
	username?: string;
	last_text?: string;
	last_message_at?: string;
	unread_count?: number;
	pending?: boolean;
	banned?: boolean;
	exempt?: boolean;
};

type ChatMessage = {
	id?: string | number;
	direction?: "inbound" | "outbound";
	text?: string;
	message_type?: string;
	created_at?: string;
	media?: {
		kind?: string;
		filename?: string;
	};
};

type ChatData = {
	unread_total?: number;
	contacts?: ChatContact[];
	messages?: ChatMessage[];
	profile?: {
		name?: string;
		username?: string;
		user_id?: number | string;
		language?: string;
		ban_text?: string;
		exempt?: boolean;
	};
	settings?: {
		operations_enabled?: boolean;
		bot_notifications_enabled?: boolean;
	};
};

type ChatStatus = {
	services?: {
		web?: { status?: string };
		bot?: { status?: string };
	};
	control?: { configured?: boolean };
};

export let chatData: ChatData | null = null;
export let chatStatus: ChatStatus | null = null;
export let selectedChatUserId: number | null = null;
export let chatSearch = "";
export let chatReplyText = "";
export let chatCommandText = "";
export let chatCommandResult = "";
export let chatUploadFile: File | null = null;
export let isSendingChat = false;
export let onRefresh: () => void;
export let onSelectContact: (userId: number) => void;
export let onSendReply: (event: Event) => void;
export let onUserAction: (action: string, minutes?: number | null) => void;
export let onChatAction: (action: "takeover" | "resume-web") => void;
export let onToggleNotifications: () => void;
export let onRunCommand: (text: string) => void;
export let mediaUrl: (message: ChatMessage) => string;

let messagesPane: HTMLDivElement;
let lastScrollKey = "";

function icon(name: string) {
	if (name === "send")
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-4 w-4"><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></svg>`;
	if (name === "refresh")
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-4 w-4"><path d="M21 12a9 9 0 0 1-15.5 6.2" /><path d="M3 12A9 9 0 0 1 18.5 5.8" /><path d="M18 2v4h4" /><path d="M6 22v-4H2" /></svg>`;
	return "";
}

function initials(name = "") {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (!parts.length) return "?";
	return parts
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");
}

function chatTime(value = "") {
	const match = value.match(/\d{2}:\d{2}(?::\d{2})?/);
	return match ? match[0].slice(0, 5) : value;
}

function selectedChatContact() {
	return (chatData?.contacts ?? []).find(
		(contact) => contact.user_id === selectedChatUserId,
	);
}

function statusTone(value = "") {
	const normalized = value.toLowerCase();
	if (normalized.includes("active") || normalized.includes("running"))
		return "border-[#38bdf8]/45 bg-[#123847] text-[#8be7ff]";
	if (normalized.includes("disabled") || normalized.includes("stopped"))
		return "border-rose-400/45 bg-rose-500/12 text-rose-200";
	return "border-[#294657] bg-[#0b1a24] text-[#9bb8c6]";
}

function riskLabel() {
	if (chatData?.profile?.ban_text && chatData.profile.ban_text !== "normal")
		return chatData.profile.ban_text;
	if (chatData?.profile?.exempt) return "exempt";
	return "normal";
}

function riskTone() {
	const label = riskLabel().toLowerCase();
	if (label.includes("ban"))
		return "border-rose-400/45 bg-rose-500/12 text-rose-200";
	if (label.includes("exempt"))
		return "border-violet-400/45 bg-violet-500/12 text-violet-200";
	return "border-emerald-400/45 bg-emerald-500/12 text-emerald-200";
}

function handleUploadChange(event: Event) {
	chatUploadFile = (event.currentTarget as HTMLInputElement).files?.[0] ?? null;
}

$: filteredContacts = chatSearch.trim()
	? (chatData?.contacts ?? []).filter((contact) =>
			[contact.name, contact.username, contact.user_id, contact.last_text]
				.join(" ")
				.toLowerCase()
				.includes(chatSearch.trim().toLowerCase()),
		)
	: (chatData?.contacts ?? []);

$: {
	const messages = chatData?.messages ?? [];
	const latestMessage = messages.length
		? messages[messages.length - 1]?.id
		: "";
	const scrollKey = `${selectedChatUserId ?? ""}:${messages.length}:${latestMessage}`;
	if (messagesPane && messages.length && scrollKey !== lastScrollKey) {
		lastScrollKey = scrollKey;
		void tick().then(() => {
			if (messagesPane) messagesPane.scrollTop = messagesPane.scrollHeight;
		});
	}
}
</script>

<div class="overflow-hidden border-y border-[#223846] bg-[#0e1b25] shadow-none lg:h-[calc(100vh-7.55rem)] lg:min-h-[43rem]">
	<div class="grid min-h-0 grid-cols-1 bg-[#0e1b25] lg:h-full lg:grid-cols-[24rem_minmax(0,1fr)] xl:grid-cols-[24rem_minmax(0,1fr)_23rem] 2xl:grid-cols-[27rem_minmax(0,1fr)_24rem]">
		<section class="flex min-h-[22rem] flex-col border-b border-[#223846] bg-[#102532] lg:h-full lg:min-h-0 lg:border-b-0 lg:border-r">
			<div class="border-b border-[#223846] px-4 py-4">
				<div class="flex items-center gap-3">
					<div class="grid h-11 w-11 place-items-center rounded-full border border-[#38bdf8]/40 bg-[#07121a] text-sm font-bold text-[#8be7ff] shadow-[0_0_24px_rgb(56_189_248/0.14)]">SF</div>
					<div class="min-w-0 flex-1">
						<h2 class="truncate text-base font-semibold text-white">Conversation Queue</h2>
						<p class="text-sm text-[#86a6b6]">{chatData?.unread_total ?? 0} unread conversations</p>
					</div>
					<button class="grid h-11 w-11 place-items-center rounded-full border border-[#294657] bg-[#142c3b] text-[#8bb6c8] transition duration-150 hover:border-[#38bdf8]/60 hover:text-[#8be7ff] active:scale-95" on:click={onRefresh} aria-label="Refresh chat" title="Refresh chat">
					{@html icon("refresh")}
				</button>
				</div>
			</div>

			<div class="border-b border-[#223846] px-4 py-3">
				<input class="h-11 w-full rounded-full border border-[#294657] bg-[#0b1a24] px-4 text-sm text-slate-100 outline-none transition placeholder:text-[#668596] focus:border-[#38bdf8]/70 focus:ring-2 focus:ring-[#38bdf8]/20" bind:value={chatSearch} placeholder="Search name, username, user ID" />
			</div>

			<div class="min-h-0 flex-1 overflow-y-auto p-2">
				{#if !chatData}
					<div class="space-y-2 px-1">
						{#each Array(5) as _}
							<div class="chat-skeleton h-[4.75rem] rounded-lg"></div>
						{/each}
					</div>
				{:else}
					{#each filteredContacts as contact}
						<button type="button" class="group mb-1 flex min-h-[4.9rem] w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition duration-150 active:scale-[0.99] {selectedChatUserId === contact.user_id ? 'border-[#39c7e8]/70 bg-[#1f6e85] text-white shadow-[inset_3px_0_0_rgb(103_232_249),0_10px_28px_rgb(0_0_0/0.18)]' : 'border-transparent text-slate-100 hover:border-[#294657] hover:bg-[#142c3b]'}" on:click={() => onSelectContact(contact.user_id)}>
							<div class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#07121a] text-sm font-semibold text-[#8be7ff] shadow-sm">
								{initials(contact.name)}
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-2">
									<strong class="truncate text-[15px] font-semibold leading-5">{contact.name}</strong>
									<span class="shrink-0 text-xs font-medium text-[#8bb6c8]">{chatTime(contact.last_message_at)}</span>
								</div>
								<div class="mt-0.5 flex items-center gap-2">
									<span class="truncate text-sm text-[#9bb8c6]">{contact.last_text || contact.username || contact.user_id}</span>
									{#if contact.unread_count}
										<span class="ml-auto rounded-full bg-[#43d7f5] px-2 py-0.5 text-[11px] font-semibold text-[#06202b] shadow-sm">{contact.unread_count}</span>
									{/if}
								</div>
								{#if contact.pending || contact.banned || contact.exempt}
									<div class="mt-1.5 flex flex-wrap gap-1 text-[10px] font-bold uppercase tracking-wide">
										{#if contact.pending}<span class="rounded bg-amber-400/15 px-1.5 py-0.5 text-amber-200">pending</span>{/if}
										{#if contact.banned}<span class="rounded bg-rose-400/15 px-1.5 py-0.5 text-rose-200">banned</span>{/if}
										{#if contact.exempt}<span class="rounded bg-violet-400/15 px-1.5 py-0.5 text-violet-200">exempt</span>{/if}
									</div>
								{/if}
							</div>
						</button>
					{/each}
					{#if !filteredContacts.length}
						<p class="rounded-xl p-4 text-sm text-[#8bb6c8]">No contacts found.</p>
					{/if}
				{/if}
			</div>
		</section>

		<section class="flex min-h-[36rem] flex-col bg-[#0a1720] lg:h-full lg:min-h-0">
			<div class="border-b border-[#223846] bg-[#122634] px-4 py-3 sm:px-5">
				<div class="flex items-start gap-3">
					<div class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#07121a] text-sm font-semibold text-[#8be7ff] ring-1 ring-[#38bdf8]/30">
					{initials(chatData?.profile?.name ?? selectedChatContact()?.name ?? "")}
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
							<div class="min-w-0">
								<h2 class="truncate text-xl font-semibold tracking-tight text-white">{chatData?.profile?.name ?? "Select a contact"}</h2>
								<p class="mt-1 truncate text-sm text-[#8bb6c8]">{chatData?.profile ? `${chatData.profile.username} / user ${chatData.profile.user_id} / ${chatData.profile.language || "language unknown"}` : "Choose a conversation from the queue."}</p>
							</div>
							<div class="flex flex-wrap gap-2 text-xs">
								<span class="rounded-lg border px-2.5 py-1 font-semibold {riskTone()}">Risk: {riskLabel()}</span>
								<span class="rounded-lg border px-2.5 py-1 font-semibold {statusTone(chatStatus?.services?.web?.status ?? '')}">Web: {chatStatus?.services?.web?.status ?? "unknown"}</span>
								<span class="rounded-lg border px-2.5 py-1 font-semibold {statusTone(chatStatus?.services?.bot?.status ?? '')}">Bot: {chatStatus?.services?.bot?.status ?? "unknown"}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div bind:this={messagesPane} class="telegram-chat-bg min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-6 2xl:px-10">
				{#if !chatData}
					<div class="mx-auto mt-16 w-full max-w-sm space-y-3">
						<div class="chat-skeleton h-12 rounded-2xl"></div>
						<div class="chat-skeleton ml-auto h-12 w-4/5 rounded-2xl"></div>
						<div class="chat-skeleton h-16 w-5/6 rounded-2xl"></div>
					</div>
				{:else}
					{#each chatData?.messages ?? [] as message}
						<div class="flex {message.direction === 'outbound' ? 'justify-end' : 'justify-start'}">
							<div class="max-w-[min(86%,48rem)] rounded-2xl border px-4 py-3 text-[15px] leading-6 shadow-lg transition duration-150 hover:-translate-y-px {message.direction === 'outbound' ? 'rounded-br-md border-[#3fd5ef]/30 bg-[#237f9a] text-white shadow-black/20' : 'rounded-bl-md border-[#254353] bg-[#172f3e] text-slate-50 shadow-black/20'}">
								<p class="whitespace-pre-wrap break-words">{message.text || message.message_type}</p>
								{#if message.media}
									<a class="mt-3 block rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium underline-offset-2 hover:underline" href={mediaUrl(message)} target="_blank" rel="noreferrer">{message.media.kind}: {message.media.filename}</a>
								{/if}
								<p class="mt-2 text-right text-[11px] font-medium opacity-65">{chatTime(message.created_at)}</p>
							</div>
						</div>
					{/each}
					{#if !(chatData?.messages ?? []).length}
						<p class="mx-auto mt-20 max-w-sm rounded-xl border border-[#254353] bg-[#172f3e]/90 p-5 text-center text-sm text-[#9bb8c6] shadow-sm">Select a conversation to start managing replies.</p>
					{/if}
					{#if chatCommandResult}
						<pre class="mx-auto max-w-3xl whitespace-pre-wrap rounded-xl border border-[#2e4d5d] bg-[#0b1a24]/95 p-4 text-xs leading-5 text-[#b8d4df] shadow-sm">{chatCommandResult}</pre>
					{/if}
				{/if}
			</div>

			<form class="border-t border-[#223846] bg-[#122634] px-3 py-3 sm:px-4" on:submit={onSendReply}>
				<div class="flex items-end gap-2">
					<label class="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-[#294657] bg-[#0b1a24] text-[#8bb6c8] transition duration-150 hover:border-[#38bdf8]/60 hover:text-[#8be7ff] active:scale-95" title="Attach file">
						<span class="text-xl">+</span>
						<input class="hidden" type="file" disabled={!chatData?.profile || !chatData?.settings?.operations_enabled || isSendingChat} on:change={handleUploadChange} />
					</label>
					<div class="min-w-0 flex-1 rounded-2xl border border-[#294657] bg-[#0b1a24] px-4 py-2">
						{#if chatUploadFile}
							<div class="mb-2 flex items-center gap-2 rounded-lg border border-[#294657] bg-[#142c3b] px-3 py-2 text-xs text-slate-200">
								<span class="min-w-0 flex-1 truncate">{chatUploadFile.name}</span>
								<button type="button" class="min-h-8 text-[#8bb6c8] hover:text-white" on:click={() => { chatUploadFile = null; }}>Remove</button>
							</div>
						{/if}
						<textarea class="max-h-32 min-h-9 w-full resize-none bg-transparent text-[15px] leading-6 text-slate-50 outline-none placeholder:text-[#668596]" bind:value={chatReplyText} placeholder={chatData?.settings?.operations_enabled ? "Message as owner" : "Web control is locked"} disabled={!chatData?.profile || !chatData?.settings?.operations_enabled || isSendingChat}></textarea>
					</div>
					<button class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#35bfe0] text-sm font-semibold text-[#06202b] transition duration-150 hover:bg-[#69def4] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#233a49] disabled:text-[#668596]" disabled={!chatData?.profile || (!chatReplyText.trim() && !chatUploadFile) || !chatData?.settings?.operations_enabled || isSendingChat} aria-label="Send message">
						{#if isSendingChat}<span class="chat-spinner"></span>{:else}{@html icon("send")}{/if}
					</button>
				</div>
			</form>
		</section>

		<aside class="flex min-h-0 flex-col border-t border-[#223846] bg-[#102532] xl:h-full xl:border-l xl:border-t-0">
			<div class="border-b border-[#223846] px-5 py-4">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-[#6e91a2]">Operator Panel</p>
				<h2 class="mt-1 truncate text-lg font-semibold text-white">{chatData?.profile?.name ?? "No contact selected"}</h2>
				<p class="mt-1 truncate text-sm text-[#8bb6c8]">{chatData?.profile?.username ?? "Select a conversation"}</p>
			</div>
			<div class="min-h-0 flex-1 overflow-y-auto p-4">
				<div class="rounded-xl border border-[#294657] bg-[#0b1a24] p-3 text-sm shadow-inner shadow-black/15">
					<div class="flex justify-between gap-3 py-1.5"><span class="text-[#86a6b6]">Risk</span><strong class="text-white">{riskLabel()}</strong></div>
					<div class="flex justify-between gap-3 py-1.5"><span class="text-[#86a6b6]">Web session</span><strong class="text-white">{chatStatus?.services?.web?.status ?? "unknown"}</strong></div>
					<div class="flex justify-between gap-3 py-1.5"><span class="text-[#86a6b6]">Bot service</span><strong class="text-white">{chatStatus?.services?.bot?.status ?? "unknown"}</strong></div>
				</div>

				<div class="mt-5 space-y-5">
					<section>
						<h3 class="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6e91a2]">Moderation actions</h3>
						<div class="grid grid-cols-2 gap-2">
							<button class="min-h-11 rounded-lg border border-rose-400/35 bg-rose-500/12 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45" disabled={!chatData?.profile || !chatData?.settings?.operations_enabled} on:click={() => onUserAction("ban", 30)}>Ban 30m</button>
							<button class="min-h-11 rounded-lg border border-rose-300 bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45" disabled={!chatData?.profile || !chatData?.settings?.operations_enabled} on:click={() => onUserAction("ban", null)}>Ban forever</button>
							<button class="min-h-11 rounded-lg border border-[#294657] bg-[#142c3b] px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-[#38bdf8]/60 hover:text-[#8be7ff] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45" disabled={!chatData?.profile || !chatData?.settings?.operations_enabled} on:click={() => onUserAction("pardon")}>Pardon</button>
							<button class="min-h-11 rounded-lg border border-violet-400/35 bg-violet-500/12 px-3 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45" disabled={!chatData?.profile || !chatData?.settings?.operations_enabled} on:click={() => onUserAction(chatData?.profile?.exempt ? "unexempt" : "exempt")}>{chatData?.profile?.exempt ? "Unexempt" : "Exempt"}</button>
						</div>
					</section>

					<section>
						<h3 class="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6e91a2]">Web session actions</h3>
						<div class="space-y-2">
							<button class="min-h-11 w-full rounded-lg border border-[#38bdf8]/40 bg-[#123847] px-3 py-2 text-sm font-semibold text-[#8be7ff] transition hover:bg-[#16475a] active:scale-[0.98]" on:click={onRefresh}>Refresh console</button>
							<button class="min-h-11 w-full rounded-lg border border-[#294657] bg-[#142c3b] px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-[#38bdf8]/60 hover:text-[#8be7ff] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45" disabled={!chatData?.settings?.operations_enabled} on:click={onToggleNotifications}>
								{chatData?.settings?.bot_notifications_enabled ? "Disable owner previews" : "Enable owner previews"}
							</button>
						</div>
					</section>

					<section>
						<h3 class="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6e91a2]">Bot actions</h3>
						<div class="grid grid-cols-1 gap-2">
							<button class="min-h-11 rounded-lg border border-amber-400/40 bg-amber-500/12 px-3 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45" on:click={() => onChatAction("takeover")} disabled={!chatStatus?.control?.configured}>Bot takeover</button>
							<button class="min-h-11 rounded-lg border border-emerald-400/40 bg-emerald-500/12 px-3 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45" on:click={() => onChatAction("resume-web")} disabled={!chatStatus?.control?.configured}>Resume Web control</button>
						</div>
					</section>

					<section>
						<h3 class="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6e91a2]">Command runner</h3>
						<form class="flex gap-2" on:submit|preventDefault={() => onRunCommand(chatCommandText)}>
							<input class="min-h-11 min-w-0 flex-1 rounded-lg border border-[#294657] bg-[#0b1a24] px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-[#668596] focus:border-[#38bdf8]/70 focus:ring-2 focus:ring-[#38bdf8]/20" bind:value={chatCommandText} placeholder="/status" />
							<button class="min-h-11 rounded-lg bg-[#35bfe0] px-4 py-2 text-sm font-semibold text-[#06202b] transition hover:bg-[#69def4] active:scale-[0.98]">Run</button>
						</form>
					</section>
				</div>
			</div>
		</aside>
	</div>
</div>

<style>
	.telegram-chat-bg {
		background-color: #e6ebee;
		background-image:
			radial-gradient(circle at 12px 18px, rgb(42 171 238 / 0.06) 0 2px, transparent 2px),
			radial-gradient(circle at 44px 42px, rgb(42 171 238 / 0.05) 0 1.5px, transparent 1.5px);
		background-size: 64px 64px;
	}

	:global(.dark) .telegram-chat-bg {
		background-color: #0e1621;
		background-image:
			radial-gradient(circle at 12px 18px, rgb(42 171 238 / 0.08) 0 2px, transparent 2px),
			radial-gradient(circle at 44px 42px, rgb(42 171 238 / 0.07) 0 1.5px, transparent 1.5px);
	}

	.chat-skeleton {
		background: linear-gradient(90deg, rgb(228 228 231 / 0.7), rgb(244 244 245), rgb(228 228 231 / 0.7));
		background-size: 200% 100%;
		animation: chat-shimmer 1.2s ease-in-out infinite;
	}

	:global(.dark) .chat-skeleton {
		background: linear-gradient(90deg, rgb(36 47 61 / 0.7), rgb(43 59 78), rgb(36 47 61 / 0.7));
		background-size: 200% 100%;
	}

	.chat-spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid rgb(255 255 255 / 0.45);
		border-top-color: white;
		border-radius: 9999px;
		animation: chat-spin 0.75s linear infinite;
	}

	@keyframes chat-shimmer {
		to {
			background-position: -200% 0;
		}
	}

	@keyframes chat-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.chat-skeleton,
		.chat-spinner {
			animation: none;
		}
	}
</style>
