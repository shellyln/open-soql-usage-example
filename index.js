
import { compile, soql, insert, update, remove, touch, transaction, subscribe, unsubscribe } from './commands';



function yieldToNextEvtLoop() {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 0);
    });
    return promise;
}


try {
    const subscriber = ({resolver, on, id}) => {
        console.log(`Subscription recieved: ${resolver}, ${on}, ${id}`);
    };

    subscribe('Contact', null, subscriber);
    {
        const query = compile`
            select
                id, foo, bar, baz, acc.id, acc.name,
                (select id, name, amount from acc.opportunities)
            from
                contact con, account acc
            where acc.id > :aid
            order by id, foo desc
            offset :offset limit :limit`;
        const result = await query.execute({ aid: '', offset: 2, limit: 1 })
        console.log(result);

        const selected = await soql`
            select
                id, foo, bar, baz, acc.id, acc.name,
                (select id, name, amount from acc.opportunities)
            from
                contact con, account acc
            where acc.id > ${''}
            order by id, foo desc
            offset ${1} limit ${2}`;
        console.log(selected);

        const inserted = await insert('Contact', [{ Foo: 'w1' }]);
        console.log(inserted);

        const updated = await update('Contact', inserted);
        console.log(updated);

        await touch('Contact', updated);

        await remove('Contact', updated);
    }
    unsubscribe('Contact', null, subscriber);
    await yieldToNextEvtLoop();


    subscribe('Contact', null, subscriber);
    await transaction(async (commands, tr) => {
        const { compile, soql, insert, update, remove, touch } = commands;

        const query = compile`
            select
                id, foo, bar, baz, acc.id, acc.name,
                (select id, name, amount from acc.opportunities)
            from
                contact con, account acc
            where acc.id > :aid
            order by id, foo desc
            offset :offset limit :limit`;
        const result = await query.execute({ aid: '', offset: 2, limit: 1 })
        console.log(result);

        const selected = await soql`
            select
                id, foo, bar, baz, acc.id, acc.name,
                (select id, name, amount from acc.opportunities)
            from
                contact con, account acc
            where acc.id > ${''}
            order by id, foo desc
            offset ${1} limit ${2}`;
        console.log(selected);

        const inserted = await insert('Contact', [{ Foo: 'w1' }]);
        console.log(inserted);

        const updated = await update('Contact', inserted);
        console.log(updated);

        await touch('Contact', updated);

        await remove('Contact', updated);
    });
    unsubscribe('Contact', null, subscriber);
    await yieldToNextEvtLoop();
} catch (e) {
    console.log(e);
}
