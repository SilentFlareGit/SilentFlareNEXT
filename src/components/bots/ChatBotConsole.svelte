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

<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/60 dark:border-zinc-800 dark:bg-[#17212b] dark:shadow-black/20 lg:h-[calc(100vh-12.5rem)] lg:min-h-[34rem]">
	<div class="grid min-h-0 grid-cols-1 bg-white dark:bg-[#17212b] lg:h-full lg:grid-cols-[21rem_minmax(0,1fr)] xl:grid-cols-[21rem_minmax(0,1fr)_19rem]">
		<section class="flex min-h-[19rem] flex-col border-b border-zinc-200 bg-white dark:border-[#253545] dark:bg-[#17212b] lg:h-full lg:min-h-0 lg:border-b-0 lg:border-r">
			<div class="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 dark:border-[#253545]">
				<div class="grid h-10 w-10 place-items-center rounded-full bg-[#2aabee] text-sm font-bold text-white shadow-sm">SF</div>
				<div class="min-w-0 flex-1">
					<h2 class="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">Telegram Chat Bot</h2>
					<p class="text-xs text-zinc-500 dark:text-zinc-400">{chatData?.unread_total ?? 0} unread conversations</p>
				</div>
				<button class="grid h-11 w-11 place-items-center rounded-full text-zinc-500 transition duration-150 hover:bg-zinc-100 active:scale-95 dark:text-zinc-300 dark:hover:bg-[#223142]" on:click={onRefresh} aria-label="Refresh chat" title="Refresh chat">
					{@html icon("refresh")}
				</button>
			</div>

			<div class="px-3 py-3">
				<input class="h-11 w-full rounded-full bg-zinc-100 px-4 text-sm text-zinc-800 outline-none transition focus:ring-2 focus:ring-[#2aabee]/30 dark:bg-[#242f3d] dark:text-zinc-100 dark:placeholder:text-zinc-400" bind:value={chatSearch} placeholder="Search conversations" />
			</div>

			<div class="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
				{#if !chatData}
					<div class="space-y-2 px-1">
						{#each Array(5) as _}
							<div class="chat-skeleton h-16 rounded-xl"></div>
						{/each}
					</div>
				{:else}
					{#each filteredContacts as contact}
						<button type="button" class="group mb-1 flex min-h-16 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition duration-150 active:scale-[0.99] {selectedChatUserId === contact.user_id ? 'bg-[#2aabee] text-white shadow-sm shadow-sky-500/30' : 'text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-[#223142]'}" on:click={() => onSelectContact(contact.user_id)}>
							<div class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2aabee] to-[#275f86] text-sm font-semibold text-white shadow-sm">
								{initials(contact.name)}
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between gap-2">
									<strong class="truncate text-sm font-semibold">{contact.name}</strong>
									<span class="shrink-0 text-[11px] opacity-70">{chatTime(contact.last_message_at)}</span>
								</div>
								<div class="mt-0.5 flex items-center gap-2">
									<span class="truncate text-sm opacity-70">{contact.last_text || contact.username || contact.user_id}</span>
									{#if contact.unread_count}
										<span class="ml-auto rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-[#2aabee]">{contact.unread_count}</span>
									{/if}
								</div>
								{#if contact.pending || contact.banned || contact.exempt}
									<div class="mt-1 flex flex-wrap gap-1 text-[10px] uppercase tracking-wide opacity-70">
										{#if contact.pending}<span>pending</span>{/if}
										{#if contact.banned}<span>banned</span>{/if}
										{#if contact.exempt}<span>exempt</span>{/if}
									</div>
								{/if}
							</div>
						</button>
					{/each}
					{#if !filteredContacts.length}
						<p class="rounded-xl p-4 text-sm text-zinc-500 dark:text-zinc-400">No contacts found.</p>
					{/if}
				{/if}
			</div>
		</section>

		<section class="flex min-h-[32rem] flex-col bg-[#e6ebee] dark:bg-[#0e1621] lg:h-full lg:min-h-0">
			<div class="flex items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-[#253545] dark:bg-[#17212b]/95 sm:px-5">
				<div class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2aabee] to-[#275f86] text-sm font-semibold text-white">
					{initials(chatData?.profile?.name ?? selectedChatContact()?.name ?? "")}
				</div>
				<div class="min-w-0 flex-1">
					<h2 class="truncate text-base font-semibold text-zinc-950 dark:text-zinc-50">{chatData?.profile?.name ?? "Select a contact"}</h2>
					<p class="truncate text-xs text-zinc-500 dark:text-zinc-400">{chatData?.profile ? `${chatData.profile.username} / ${chatData.profile.user_id} / ${chatData.profile.language}` : "Choose a conversation from the inbox."}</p>
				</div>
				<span class="hidden rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-[#242f3d] dark:text-zinc-300 sm:inline-flex">{chatData?.settings?.operations_enabled ? "Web control" : "Bot takeover"}</span>
			</div>

			<div bind:this={messagesPane} class="telegram-chat-bg min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-4 sm:px-8 sm:py-5">
				{#if !chatData}
					<div class="mx-auto mt-16 w-full max-w-sm space-y-3">
						<div class="chat-skeleton h-12 rounded-2xl"></div>
						<div class="chat-skeleton ml-auto h-12 w-4/5 rounded-2xl"></div>
						<div class="chat-skeleton h-16 w-5/6 rounded-2xl"></div>
					</div>
				{:else}
					{#each chatData?.messages ?? [] as message}
						<div class="flex {message.direction === 'outbound' ? 'justify-end' : 'justify-start'}">
							<div class="max-w-[min(84%,42rem)] rounded-2xl px-3.5 py-2 text-[15px] leading-relaxed shadow-sm transition duration-150 hover:-translate-y-px {message.direction === 'outbound' ? 'rounded-br-md bg-[#2aabee] text-white' : 'rounded-bl-md bg-white text-zinc-900 dark:bg-[#182533] dark:text-zinc-50'}">
								<p class="whitespace-pre-wrap break-words">{message.text || message.message_type}</p>
								{#if message.media}
									<a class="mt-2 block rounded-xl bg-black/5 px-3 py-2 text-xs underline-offset-2 hover:underline dark:bg-white/10" href={mediaUrl(message)} target="_blank" rel="noreferrer">{message.media.kind}: {message.media.filename}</a>
								{/if}
								<p class="mt-1 text-right text-[11px] opacity-65">{chatTime(message.created_at)}</p>
							</div>
						</div>
					{/each}
					{#if !(chatData?.messages ?? []).length}
						<p class="mx-auto mt-20 max-w-sm rounded-2xl bg-white/80 p-5 text-center text-sm text-zinc-500 shadow-sm dark:bg-[#182533] dark:text-zinc-300">Select a conversation to start managing replies.</p>
					{/if}
					{#if chatCommandResult}
						<pre class="mx-auto max-w-2xl whitespace-pre-wrap rounded-xl bg-white/90 p-4 text-xs text-zinc-700 shadow-sm dark:bg-[#182533] dark:text-zinc-200">{chatCommandResult}</pre>
					{/if}
				{/if}
			</div>

			<form class="border-t border-zinc-200 bg-white px-3 py-3 dark:border-[#253545] dark:bg-[#17212b] sm:px-4" on:submit={onSendReply}>
				<div class="flex items-end gap-2">
					<label class="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-zinc-500 transition duration-150 hover:bg-zinc-100 active:scale-95 dark:text-zinc-300 dark:hover:bg-[#242f3d]" title="Attach file">
						<span class="text-xl">+</span>
						<input class="hidden" type="file" disabled={!chatData?.profile || !chatData?.settings?.operations_enabled || isSendingChat} on:change={handleUploadChange} />
					</label>
					<div class="min-w-0 flex-1 rounded-2xl bg-zinc-100 px-4 py-2 dark:bg-[#242f3d]">
						{#if chatUploadFile}
							<div class="mb-2 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-zinc-700 dark:bg-[#17212b] dark:text-zinc-200">
								<span class="min-w-0 flex-1 truncate">{chatUploadFile.name}</span>
								<button type="button" class="min-h-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white" on:click={() => { chatUploadFile = null; }}>Remove</button>
							</div>
						{/if}
						<textarea class="max-h-32 min-h-8 w-full resize-none bg-transparent text-sm text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50" bind:value={chatReplyText} placeholder={chatData?.settings?.operations_enabled ? "Message" : "Web control is locked"} disabled={!chatData?.profile || !chatData?.settings?.operations_enabled || isSendingChat}></textarea>
					</div>
					<button class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#2aabee] text-sm font-semibold text-white transition duration-150 hover:bg-[#229ed9] active:scale-95 disabled:opacity-50" disabled={!chatData?.profile || (!chatReplyText.trim() && !chatUploadFile) || !chatData?.settings?.operations_enabled || isSendingChat} aria-label="Send message">
						{#if isSendingChat}<span class="chat-spinner"></span>{:else}{@html icon("send")}{/if}
					</button>
				</div>
			</form>
		</section>

		<aside class="hidden h-full min-h-0 flex-col border-l border-zinc-200 bg-white dark:border-[#253545] dark:bg-[#17212b] xl:flex">
			<div class="border-b border-zinc-100 px-5 py-5 text-center dark:border-[#253545]">
				<div class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#2aabee] to-[#275f86] text-xl font-semibold text-white shadow-sm">
					{initials(chatData?.profile?.name ?? selectedChatContact()?.name ?? "")}
				</div>
				<h2 class="mt-3 truncate text-base font-semibold text-zinc-950 dark:text-zinc-50">{chatData?.profile?.name ?? "No contact selected"}</h2>
				<p class="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{chatData?.profile?.username ?? "Select a conversation"}</p>
			</div>
			<div class="min-h-0 flex-1 overflow-y-auto p-4">
				<div class="rounded-xl bg-zinc-50 p-3 text-sm dark:bg-[#242f3d]">
					<div class="flex justify-between gap-3 py-1"><span class="text-zinc-500 dark:text-zinc-400">Status</span><strong class="text-zinc-900 dark:text-zinc-100">{chatData?.profile?.ban_text || "normal"}</strong></div>
					<div class="flex justify-between gap-3 py-1"><span class="text-zinc-500 dark:text-zinc-400">Web</span><strong class="text-zinc-900 dark:text-zinc-100">{chatStatus?.services?.web?.status ?? "unknown"}</strong></div>
					<div class="flex justify-between gap-3 py-1"><span class="text-zinc-500 dark:text-zinc-400">Bot</span><strong class="text-zinc-900 dark:text-zinc-100">{chatStatus?.services?.bot?.status ?? "unknown"}</strong></div>
				</div>
				<div class="mt-4 grid grid-cols-2 gap-2">
					<button class="min-h-11 rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-800 transition duration-150 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 dark:bg-[#242f3d] dark:text-zinc-100 dark:hover:bg-[#2b3b4e]" disabled={!chatData?.profile || !chatData?.settings?.operations_enabled} on:click={() => onUserAction("ban", 30)}>Ban 30m</button>
					<button class="min-h-11 rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-800 transition duration-150 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 dark:bg-[#242f3d] dark:text-zinc-100 dark:hover:bg-[#2b3b4e]" disabled={!chatData?.profile || !chatData?.settings?.operations_enabled} on:click={() => onUserAction("ban", null)}>Forever</button>
					<button class="min-h-11 rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-800 transition duration-150 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 dark:bg-[#242f3d] dark:text-zinc-100 dark:hover:bg-[#2b3b4e]" disabled={!chatData?.profile || !chatData?.settings?.operations_enabled} on:click={() => onUserAction("pardon")}>Pardon</button>
					<button class="min-h-11 rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-800 transition duration-150 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 dark:bg-[#242f3d] dark:text-zinc-100 dark:hover:bg-[#2b3b4e]" disabled={!chatData?.profile || !chatData?.settings?.operations_enabled} on:click={() => onUserAction(chatData?.profile?.exempt ? "unexempt" : "exempt")}>{chatData?.profile?.exempt ? "Unexempt" : "Exempt"}</button>
				</div>
				<div class="mt-5 space-y-2">
					<button class="min-h-11 w-full rounded-xl bg-[#2aabee] px-3 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-[#229ed9] active:scale-[0.98]" on:click={onRefresh}>Refresh</button>
					<button class="min-h-11 w-full rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-800 transition duration-150 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 dark:bg-[#242f3d] dark:text-zinc-100 dark:hover:bg-[#2b3b4e]" on:click={() => onChatAction("takeover")} disabled={!chatStatus?.control?.configured}>Bot takeover</button>
					<button class="min-h-11 w-full rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-800 transition duration-150 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 dark:bg-[#242f3d] dark:text-zinc-100 dark:hover:bg-[#2b3b4e]" on:click={() => onChatAction("resume-web")} disabled={!chatStatus?.control?.configured}>Resume Web</button>
				</div>
				<button class="mt-4 min-h-11 w-full rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-800 transition duration-150 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 dark:bg-[#242f3d] dark:text-zinc-100 dark:hover:bg-[#2b3b4e]" disabled={!chatData?.settings?.operations_enabled} on:click={onToggleNotifications}>
					{chatData?.settings?.bot_notifications_enabled ? "Disable previews" : "Enable previews"}
				</button>
				<form class="mt-4 flex gap-2" on:submit|preventDefault={() => onRunCommand(chatCommandText)}>
					<input class="min-h-11 min-w-0 flex-1 rounded-xl bg-zinc-100 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#2aabee]/30 dark:bg-[#242f3d] dark:text-zinc-100" bind:value={chatCommandText} placeholder="/status" />
					<button class="min-h-11 rounded-xl bg-zinc-100 px-3 py-2 text-sm transition hover:bg-zinc-200 active:scale-[0.98] dark:bg-[#242f3d] dark:text-zinc-100">Run</button>
				</form>
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
