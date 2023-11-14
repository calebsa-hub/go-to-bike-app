import SQLiteManager from '../SQLiteManager';

export default class TreinoRepository {
    addNewTreino(treino) {
        return new Promise((resolve, reject) => {
            SQLiteManager.addNewTreino(treino)
                .then((sqlite) => {
                    resolve(sqlite);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    getAllTreinos() {
      return new Promise((resolve, reject) => {
        SQLiteManager.getAllTreinos()
          .the((sqlite) => {
            resolve(sqlite)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
}