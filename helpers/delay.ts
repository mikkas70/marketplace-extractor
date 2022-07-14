const delay = (milliseconds: number): Promise<any> => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export default delay;
