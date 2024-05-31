const KNN = require('ml-knn');
const db = require('./database');

async function loadData() {
    const [rows] = await db.execute('SELECT disability_related_to, disability_with, specialities FROM doctors');
    const X = [];
    const y = [];

    rows.forEach(row => {
        X.push(JSON.parse(row.disability_related_to).concat(JSON.parse(row.disability_with)));
        y.push(row.specialities);
    });

    return { X, y };
}

async function trainModel() {
    const { X, y } = await loadData();
    const knn = new KNN(X, y, { k: 3 });
    return knn;
}

let knnModel = null;

async function initializeModel() {
    knnModel = await trainModel();
    console.log('Model trained successfully');
}

initializeModel();

module.exports = {
    getKNNModel: () => knnModel
};
