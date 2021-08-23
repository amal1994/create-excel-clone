export const checkValidColumnData = (columnData)=>{
    if(isEmpty(columnData)){
        return false
    }
    const index = columnData.findIndex(val => val!=="");

    if(!isEqualData(columnData, index)){
        return false
    }
    return true
}

export const isEmpty = (columnData)=>{
    return columnData.every( (val) => val === "" )
}

export const isEqualData = (data, index) => {
    const element = data[index];
    const isNumber = !isNaN(element)
    data = getDataWithoutEmptyValues(data)
    if(isNumber){
        return data.every( (val) => !isNaN(val) )
    }else{
        return data.every( (val) => isNaN(val) )
    }
}

export const isNumericData = (data)=>{
    data = getDataWithoutEmptyValues(data)
    return data.every( (val) => !isNaN(val) )
}

export const getDataWithoutEmptyValues = (data)=>{
    return data.filter((value)=>value!=="")
}

