
import { build } from 'open-soql/modules/builder';
import { staticCsvResolverBuilder } from 'open-soql/modules/resolvers';



export const { soql, insert, update, remove, transaction } = build({
    relationships: {                                    // Define the relationships.
        Account: {                                      // Resolver name
            Contacts: ['Contact'],                      // Relationship item name → Resolver name
            Opportunities: ['Opportunity', 'Account'],  // The case of explicitly specifying a detail's relationship item name.
        },
        Contact: {
            Account: 'Account',
        },
        Opportunity: {
            Account: 'Account',
        },
        Event: {
            Account: { resolver: 'Account', id: 'WhatId' },  // The case of explicitly specifying an Id item name.
            Contact: { resolver: 'Contact', id: 'WhatId' },
            Opportunity: { resolver: 'Opportunity', id: 'WhatId' },
        },
    },
    resolvers: {                                // Define the resolvers.
        query: {
            Contact: staticCsvResolverBuilder(  // For fixed JSON, CSV, and object arrays, we provide a standard resolver implementation for easy resolver creation.
                'Contact', () => Promise.resolve(`
                    Id         , Foo      , Bar      , Baz      , Qux      , Quux  ,   Corge , Grault       , Garply                 , AccountId
                    Contact/z1 , aaa/z1   , bbb/z1   , ccc/z1   , ddd/z1   , false ,    -1.0 , 2019-12-31   , 2019-12-31T23:59:59Z   , Account/z1
                    Contact/z2 , aaa/z2   , bbb/z2   , ccc/z2   , ddd/z2   , true  ,     0.0 , 2020-01-01   , 2020-01-01T00:00:00Z   , Account/z1
                    Contact/z3 , "aaa/z3" , "bbb/z3" , "ccc/z3" , "ddd/z3" ,       ,     1   , "2020-01-02" , "2020-01-01T00:00:01Z" , "Account/z2"
                    Contact/z4 ,          ,          ,          ,          ,       ,         ,              ,                        ,
                    Contact/z5 ,       "" ,       "" ,      " " ,       "" ,       ,         ,              ,                        ,
                `)
            ),
            Account: staticCsvResolverBuilder(
                'Account', () => Promise.resolve(`
                    Id         , Name     , Address
                    Account/z1 , fff/z1   , ggg/z1
                    Account/z2 , fff/z2   , ggg/z2
                    Account/z3 , "fff/z3" , "ggg/z3"
                    Account/z4 ,          ,
                    Account/z5 ,       "" ,       ""
                `)
            ),
            Opportunity: staticCsvResolverBuilder(
                'Opportunity', () => Promise.resolve(`
                    Id             , Name     , Amount , AccountId
                    Opportunity/z1 , hhh/z1   ,   1000 , Account/z1
                    Opportunity/z2 , hhh/z2   ,   2000 , Account/z1
                    Opportunity/z3 , "hhh/z3" ,   3000 , Account/z2
                    Opportunity/z4 ,          ,        ,
                    Opportunity/z5 , ""       ,      0 , Account/z2
                `)
            ),
            Event: staticCsvResolverBuilder(
                'Event', () => Promise.resolve(`
                    Id         , Title    , Address  , WhatId
                    Event/z1   , iii/z1   , jjj/z1   , Account/z2
                    Event/z2   , iii/z2   , jjj/z2   , Contact/z2
                    Event/z3   , "iii/z3" , "jjj/z3" , Contact/z3
                    Event/z4   ,          ,          ,
                    Event/z5   ,       "" ,       "" , Opportunity/z5
                `)
            ),
        },
        insert: {
            Contact: (records, ctx) => {
                return Promise.resolve(records.map((x, index) => {
                    return { ...x, Id: `Contact/z${index + 1}`, Count: 0 };
                }));
            }
        },
        update: {
            Contact: (records, ctx) => {
                return Promise.resolve(records.map((x, index) => {
                    return { ...x, Count: (x.Count ?? 0) + 1 };
                }));
            }
        },
        remove: {
            Contact: (records, ctx) => {
                return Promise.resolve();
            }
        },
    },
    events: {
        beginTransaction: (evt) => {
            return Promise.resolve();
        },
        endTransaction: (evt, err) => {
            return Promise.resolve();
        },
        beginExecute: (evt) => {
            return Promise.resolve();
        },
        endExecute: (evt, err) => {
            return Promise.resolve();
        },
        beforeMasterSubQueries: (evt) => {
            return Promise.resolve();
        },
        afterMasterSubQueries: (evt) => {
            return Promise.resolve();
        },
        beforeDetailSubQueries: (evt) => {
            return Promise.resolve();
        },
        afterDetailSubQueries: (evt) => {
            return Promise.resolve();
        },
    },
});
