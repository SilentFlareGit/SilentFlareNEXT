CREATE TRIGGER IF NOT EXISTS rule_versions_no_update
BEFORE UPDATE ON rule_versions BEGIN SELECT RAISE(ABORT, 'rule_versions are immutable'); END;

CREATE TRIGGER IF NOT EXISTS rule_versions_no_delete
BEFORE DELETE ON rule_versions BEGIN SELECT RAISE(ABORT, 'rule_versions are immutable'); END;
