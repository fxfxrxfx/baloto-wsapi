/**
 * Crea la recta de regresión
 */
function getRegressionLine_Ec(x, y) {
    let n = y.length;
    let lr = {};
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    y.forEach((element,index) => {
        sumX += parseFloat(x[index]);
        sumY += parseFloat(element);
        sumXY += (parseFloat(x[index]) * parseFloat(element));
        sumXX += (parseFloat(x[index]) * parseFloat(x[index]));
    });

    lr['pendiente'] = (n*sumXY - sumX*sumY) / (n*sumXX - sumX*sumX);
    lr['intercepto'] = (sumY- lr.pendiente*sumX)/n;

    return `Ecuación de la recta: Y = ${lr['pendiente']}x + ${lr['intercepto']}`;
}
/**
 * Obtiene el valor de la regresión
 */
function getRegressionLine_Val(pendiente, x, intercepto) {
    return (pendiente*x) + intercepto;
}




/********************************************************************************************************
 * *********************************************************************************************************
 * *********************************************************************************************************
 * *********************************************************************************************************
 * *********************************************************************************************************
 * *********************************************************************************************************
 * ********************************************************************************************************** */
console.log("OA");

