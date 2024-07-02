/* Pulled code from https://www.postgresql.org/message-id/20050810133157.GA46247@winnie.fuhr.org */
CREATE FUNCTION count_estimate(query text)
  RETURNS integer
  LANGUAGE plpgsql AS
$func$
DECLARE
    rec   record;
    rows  integer;
BEGIN
    FOR rec IN EXECUTE 'EXPLAIN ' || query LOOP
        rows := substring(rec."QUERY PLAN" FROM ' rows=([[:digit:]]+)');
        EXIT WHEN rows IS NOT NULL;
    END LOOP;

    RETURN rows;
END
$func$;