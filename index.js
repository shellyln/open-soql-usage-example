
import { soql, insert, update, remove, transaction } from './commands';



try {
    {
        const selected = await soql`
            select
                id, foo, bar, baz, acc.id, acc.name,
                (select id, name, amount from acc.opportunities)
            from
                contact con, account acc
            order by id, foo desc
            offset 1 limit 2`;
        console.log(selected);

        const inserted = await insert('Contact', [{ Foo: 'w1' }]);
        console.log(inserted);

        const updated = await update('Contact', inserted);
        console.log(updated);

        await remove('Contact', updated);
    }

    await transaction(async (commands, tr) => {
        const { soql, insert, update, remove } = commands;
        const selected = await soql`
            select
                id, foo, bar, baz, acc.id, acc.name,
                (select id, name, amount from acc.opportunities)
            from
                contact con, account acc
            order by id, foo desc
            offset 1 limit 2`;
        console.log(selected);

        const inserted = await insert('Contact', [{ Foo: 'w1' }]);
        console.log(inserted);

        const updated = await update('Contact', inserted);
        console.log(updated);

        await remove('Contact', updated);
    });
} catch (e) {
    console.log(e);
}
