import TreinoRepository from '../database/repository/TreinoRepository';

export default class TreinoController {
    constructor() {
        this.repository = new TreinoRepository();
    }

    addNewTreino(treino) {
        return this.repository.addNewTreino(treino);
    }

    getAllTreinos() {
      return this.repository.getAllTreinos();
    }
}