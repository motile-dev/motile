-- This was taken from https://www.percona.com/blog/power-of-postgresql-event-based-triggers/

CREATE TABLE _trigs_ddl_log (
id integer PRIMARY KEY,
username TEXT,
object_tag TEXT,
ddl_command TEXT,
timestamp TIMESTAMP
);
CREATE SEQUENCE ddl_log_seq;

CREATE OR REPLACE FUNCTION log_ddl_changes()
RETURNS event_trigger AS $$
BEGIN
INSERT INTO _trigs_ddl_log
(
id,
username,
object_tag,
ddl_command,
Timestamp
)
VALUES
(
nextval('ddl_log_seq'),
current_user,
tg_tag,
current_query(),
current_timestamp
);
END;
$$ LANGUAGE plpgsql;

CREATE EVENT TRIGGER log_ddl_trigger
ON ddl_command_end
EXECUTE FUNCTION log_ddl_changes();

CREATE PUBLICATION events FOR ALL TABLES;

ALTER TABLE chats REPLICA IDENTITY FULL;
