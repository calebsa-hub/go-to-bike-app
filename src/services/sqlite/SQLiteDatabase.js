// //import SQLite from 'react-native-sqlite-storage';
// //import * as SQLite from 'expo-sqlite';
// import SQLite from 'react-native-sqlite-storage';
// SQLite.DEBUG(true);
// SQLite.enablePromise(true);

// const database_name = 'vouDeBike.db';
// const database_version = '1.0';
// const database_displayname = 'vouDeBikeDB';
// const database_size = 200000;


// // const db = SQLite.openDatabase(
// //     database_name,
// //     database_version,
// //     database_displayname,
// //     database_size
// // );

// const db = SQLite.echoTest()
//             .then(() => {
//                 SQLite.openDatabase(
//                         database_name,
//                         database_version,
//                         database_displayname,
//                         database_size,
//                     )
//                     .then((DB) => {
//                         //this.db = DB;
//                         //db = DB;
//                         SQLite.executeSql('SELECT 1 FROM trainings LIMIT 1')
//                             .then(() => {
//                                 //
//                             })
//                             .catch((error) => {
//                                 SQLite.transaction((tx) => {
//                                       SQLite.executeSql("CREATE TABLE IF NOT EXISTS trainings (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_treino TEXT, distancia_total DOUBLE, velocidade_media DOUBLE, velocidade_maxima DOUBLE, calorias DOUBLE, ritmo DOUBLE, cadencia DOUBLE, tempo_total INTEGER, data TEXT);")
//                                         // for (const name in schema.Tables) {
//                                         //     this.createTable(tx, schema.Tables[name], name);
//                                         // }
//                                     })
//                                     .then(() => {
//                                         //
//                                     })
//                                     .catch(() => {
//                                         //
//                                     });
//                             });
//                         resolve(db);
//                     })
//                     .catch((error) => {
//                         //
//                     });
//             })
//             .catch((error) => {
//                 //
//             });

// // const db = () => {
// //     //let db;
// //     return new Promise((resolve) => {
// //         SQLite.echoTest()
// //             .then(() => {
// //                 SQLite.openDatabase(
// //                         database_name,
// //                         database_version,
// //                         database_displayname,
// //                         database_size,
// //                     )
// //                     .then((DB) => {
// //                         this.db = DB;
// //                         //db = DB;
// //                         db.executeSql('SELECT 1 FROM trainings LIMIT 1')
// //                             .then(() => {
// //                                 //
// //                             })
// //                             .catch((error) => {
// //                                 db.transaction((tx) => {
// //                                       db.executeSql("CREATE TABLE IF NOT EXISTS trainings (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_treino TEXT, distancia_total DOUBLE, velocidade_media DOUBLE, velocidade_maxima DOUBLE, calorias DOUBLE, ritmo DOUBLE, cadencia DOUBLE, tempo_total INTEGER, data TEXT);")
// //                                         // for (const name in schema.Tables) {
// //                                         //     this.createTable(tx, schema.Tables[name], name);
// //                                         // }
// //                                     })
// //                                     .then(() => {
// //                                         //
// //                                     })
// //                                     .catch(() => {
// //                                         //
// //                                     });
// //                             });
// //                         resolve(db);
// //                     })
// //                     .catch((error) => {
// //                         //
// //                     });
// //             })
// //             .catch((error) => {
// //                 //
// //             });
// //     });
// // }

// export default db;

// // class SQLiteDatabase {
// //   constructor() {
// //       this.type = 'SingletonDefaultExportInstance';
// //       this.db = null;
// //   }

// //   initDB() {
// //       let db;
// //       return new Promise((resolve) => {
// //           SQLite.echoTest()
// //               .then(() => {
// //                   SQLite.openDatabase(
// //                           database_name,
// //                           database_version,
// //                           database_displayname,
// //                           database_size,
// //                       )
// //                       .then((DB) => {
// //                           this.db = DB;
// //                           db = DB;
// //                           db.executeSql('SELECT 1 FROM trainings LIMIT 1')
// //                               .then(() => {
// //                                   //
// //                               })
// //                               .catch((error) => {
// //                                   db.transaction((tx) => {
// //                                           for (const name in schema.Tables) {
// //                                               this.createTable(tx, schema.Tables[name], name);
// //                                           }
// //                                       })
// //                                       .then(() => {
// //                                           //
// //                                       })
// //                                       .catch(() => {
// //                                           //
// //                                       });
// //                               });
// //                           resolve(db);
// //                       })
// //                       .catch((error) => {
// //                           //
// //                       });
// //               })
// //               .catch((error) => {
// //                   //
// //               });
// //       });
// //   }

// //   closeDatabase(db) {
// //       if (db) {
// //           db.close()
// //               .then((status) => {
// //                   //
// //               })
// //               .catch((error) => {
// //                   this.errorCB(error);
// //               });
// //       } else {
// //           //
// //       }
// //   }

// //   createTablesFromSchema() {
// //       if (this.db) {
// //           this.db.transaction((tx) => {
// //               for (const name in schema.Tables) {
// //                   this.createTable(tx, schema.Tables[name], name);
// //               }
// //           });
// //       }
// //   }

// //   dropDatabase() {
// //       return new Promise((resolve, reject) => {
// //           SQLite.deleteDatabase(database_name)
// //               .then(() => {
// //                   SQLite.openDatabase(
// //                       database_name,
// //                       database_version,
// //                       database_displayname,
// //                       database_size,
// //                   );
// //               })
// //               .then(() => {
// //                   resolve();
// //               })
// //               .catch((err) => {
// //                   reject(err);
// //               });
// //       }).catch((error) => {
// //           //
// //       });
// //   }

// //   createTable(tx, table, tableName) {
// //       let sql = `CREATE TABLE IF NOT EXISTS ${tableName} `;
// //       const createColumns = [];
// //       for (const key in table) {
// //           createColumns.push(
// //               `${key} ${table[key].type.type} ${
// //         table[key].primary_key ? 'PRIMARY KEY NOT NULL' : ''
// //       } default ${table[key].default_value}`,
// //           );
// //       }
// //       sql += `(${createColumns.join(', ')});`;
// //       tx.executeSql(
// //           sql,
// //           [],
// //           () => {
// //               //
// //           },
// //           () => {
// //               //
// //           },
// //       );
// //   }
// // }

// // export default new SQLiteDatabase();