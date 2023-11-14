import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

//import * as schema from './schemas';

const database_name = 'vouDeBike.db';
const database_version = '1.0';
const database_displayname = 'vouDeBikeDB';
const database_size = 200000;

export default class SQLiteManager {
  // constructor() {
  //     this.type = 'SingletonDefaultExportInstance';
  //     this.db = null;
  // }

  initDB() {
    let db;
    return new Promise((resolve) => {
      SQLite.echoTest()
        .then(() => {
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          )
            .then((DB) => {
              //this.db = DB;
              db = DB;
              db.executeSql('SELECT 1 FROM trainings LIMIT 1')
                .then(() => {
                  //
                })
                .catch((error) => {
                  db.transaction((tx) => {
                    db.executeSql(
                      "CREATE TABLE IF NOT EXISTS trainings" + 
                      "(id INTEGER PRIMARY KEY AUTOINCREMENT,"+ 
                        "nome_treino TEXT,"+ 
                        "coordenadas TEXT"+
                        "distancia_total DOUBLE,"+ 
                        "velocidade_media DOUBLE,"+ 
                        "velocidade_maxima DOUBLE,"+ 
                        "calorias DOUBLE,"+ 
                        "ritmo DOUBLE,"+ 
                        "cadencia DOUBLE,"+ 
                        "tempo_total INTEGER,"+ 
                        "data INTERGER);")
                  })
                    .then(() => {
                      console.log('Table created success!')
                    })
                    .catch(() => {
                      //
                    });
                });
              resolve(db);
            })
            .catch((error) => {
              //
            });
        })
        .catch((error) => {
          //
        });
      // this.closeDatabase(db)
    });
  }

  closeDatabase(db) {
    if (db) {
      db.close()
        .then((status) => {
          //
        })
        .catch((error) => {
          this.errorCB(error);
        });
    } else {
      //
    }
  }

  /**
* CRIAÇÃO DE UM NOVO REGISTRO
* - Recebe um objeto;
* - Retorna uma Promise:
*  - O resultado da Promise é o ID do registro (criado por AUTOINCREMENT)
*  - Pode retornar erro (reject) caso exista erro no SQL ou nos parâmetros.
*/
  create(obj) {
    return new Promise((resolve, reject) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          //comando SQL modificável
          tx.executeSql(
            "INSERT INTO trainings" + 
            "(nome_treino," + 
            "coordenadas," +
            "distancia_total," +
            "velocidade_media," + 
            "velocidade_maxima," + 
            "calorias," + 
            "ritmo," + 
            "cadencia," + 
            "tempo_total," + 
            "data) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [ 
              obj.nomeTreino, 
              obj.coordenadas, 
              obj.distanceTotalWay, 
              obj.mediaVelocity, 
              obj.maxVelocity, 
              obj.calorias, 
              obj.ritmo, 
              obj.cadencia, 
              obj.timer, 
              obj.dataAtual
            ],
            //-----------------------
            (_, { rowsAffected, insertId }) => {
              if (rowsAffected > 0) resolve(insertId);
              else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
            },
            (_, error) => reject(error) // erro interno em tx.executeSql
          );
        });
      });
    });
  };

  /**
   * ATUALIZA UM REGISTRO JÁ EXISTENTE
   * - Recebe o ID do registro e um OBJETO com valores atualizados;
   * - Retorna uma Promise:
   *  - O resultado da Promise é a quantidade de registros atualizados;
   *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
   */
  update(id, obj) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "UPDATE trainings SET nome_treino=?, distancia_total=?, velocidade_media=?, velocidade_maxima=?, calorias=?, ritmo=?, cadencia=?, tempo_total=?, data=? WHERE id=?;",
          [obj.nomeTreino, obj.distanceTotalWay, obj.mediaVelocity, obj.maxVelocity, obj.calorias, obj.ritmo, obj.cadencia, obj.timer, obj.dataAtual, id],
          //-----------------------
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) resolve(rowsAffected);
            else reject("Error updating obj: id=" + id); // nenhum registro alterado
          },
          (_, error) => reject(error) // erro interno em tx.executeSql
        );
      });
    });
  };

  updateName(id, name) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          //Query SQL para atualizar um dado no banco        
          tx.executeSql('UPDATE trainings SET nome_treino = ? WHERE id = ?', [name, id]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  /**
   * BUSCA UM REGISTRO POR MEIO DO ID
   * - Recebe o ID do registro;
   * - Retorna uma Promise:
   *  - O resultado da Promise é o objeto (caso exista);
   *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
   */
  find(id) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM trainings WHERE id=?;",
          [id],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows._array[0]);
            else reject("Obj not found: id=" + id); // nenhum registro encontrado
          },
          (_, error) => reject(error) // erro interno em tx.executeSql
        );
      });
    });
  };

  /**
   * BUSCA UM REGISTRO POR MEIO DA MARCA (brand)
   * - Recebe a marca do carro;
   * - Retorna uma Promise:
   *  - O resultado da Promise é um array com os objetos encontrados;
   *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
   *  - Pode retornar um array vazio caso nenhum objeto seja encontrado.
   */
  findByBrand(nome_treino) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM trainings WHERE nome_treino LIKE ?;",
          [nome_treino],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows._array);
            else reject("Obj not found: nome=" + nome_treino); // nenhum registro encontrado
          },
          (_, error) => reject(error) // erro interno em tx.executeSql
        );
      });
    });
  };

  /**
   * BUSCA TODOS OS REGISTROS DE UMA DETERMINADA TABELA
   * - Não recebe parâmetros;
   * - Retorna uma Promise:
   *  - O resultado da Promise é uma lista (Array) de objetos;
   *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
   *  - Pode retornar um array vazio caso não existam registros.
   */
  // all() {
  //   //let db;
  //   return new Promise((resolve, reject) => {
  //     this.initDB().then((db) => {
  //       db.transaction((tx) => {
  //         //comando SQL modificável
  //         tx.executeSql(
  //           "SELECT * FROM trainings;",
  //           [],
  //           //-----------------------
  //           (_, { rows }) => resolve(rows._array),
  //           (_, error) => reject(error) // erro interno em tx.executeSql
  //         );
  //       });
  //     })
  //   });
  // };

  all() {
    return new Promise((resolve) => {
      const lista = [];
      this.initDB().then((db) => {
        db.transaction((tx) => {
          //Query SQL para listar os dados da tabela   
          tx.executeSql('SELECT * FROM trainings ORDER BY data DESC', []).then(([tx, results]) => {

            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              const { id, nome_treino, distancia_total, velocidade_media, velocidade_maxima, calorias, ritmo, cadencia, tempo_total, data } = row;
              lista.push({ id, nome_treino, distancia_total, velocidade_media, velocidade_maxima, calorias, ritmo, cadencia, tempo_total, data });
            }
            //console.log(lista);
            resolve(lista);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });

  }

  /**
   * REMOVE UM REGISTRO POR MEIO DO ID
   * - Recebe o ID do registro;
   * - Retorna uma Promise:
   *  - O resultado da Promise a quantidade de registros removidos (zero indica que nada foi removido);
   *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
   */
  remove(id) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM trainings WHERE id = ?', [id]).then(([tx, results]) => {
            console.log(results);
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  };

  // addNewTreino(treino) {
  //     return new Promise((resolve) => {
  //         this.db
  //             .transaction((tx) => {
  //                 for (let i = 0; i < treino.length; i++) {
  //                     tx.executeSql('INSERT INTO treinos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
  //                         treino[i].nomeTreino,
  //                         treino[i].distanceTotalWay,
  //                         treino[i].mediaVelocity,
  //                         treino[i].maxVelocity,
  //                         treino[i].calorias,
  //                         treino[i].ritmo,
  //                         treino[i].cadencia,
  //                         treino[i].timer,
  //                         treino[i].dataAtual
  //                     ]).then(([tx, results]) => {
  //                         //
  //                         resolve(results);
  //                     });
  //                 }
  //             })
  //             .then((result) => {
  //                 //
  //             })
  //             .catch(() => {
  //                 //
  //             });
  //     });
  // }

  // getAllTreinos() {
  //   return new Promise((resolve) => {
  //     this.db
  //       .transaction((tx) => {
  //         tx.executeSql(
  //           'SELECT * FROM treinos',
  //           [],
  //           (tx, results) => {
  //             const records = [];
  //             for(let i = 0; i < results.rows.length; i++){
  //               records.push(results.rows.item(i));
  //             }
  //             resolve(records);
  //           },
  //           (error) => {
  //             reject(error);
  //           }
  //         );
  //       });
  //   });
  // };

  createTablesFromSchema() {
    if (this.db) {
      this.db.transaction((tx) => {
        for (const name in schema.Tables) {
          this.createTable(tx, schema.Tables[name], name);
        }
      });
    }
  }

  dropDatabase() {
    return new Promise((resolve, reject) => {
      SQLite.deleteDatabase(database_name)
        .then(() => {
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          );
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    }).catch((error) => {
      //
    });
  }

  createTable(tx, table, tableName) {
    let sql = `CREATE TABLE IF NOT EXISTS ${tableName} `;
    const createColumns = [];
    for (const key in table) {
      createColumns.push(
        `${key} ${table[key].type.type} ${table[key].primary_key ? 'PRIMARY KEY NOT NULL' : ''
        } default ${table[key].default_value}`,
      );
    }
    sql += `(${createColumns.join(', ')});`;
    tx.executeSql(
      sql,
      [],
      () => {
        //
      },
      () => {
        //
      },
    );
  }
}
