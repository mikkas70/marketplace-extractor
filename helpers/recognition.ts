import {createWorker, PSM} from "tesseract.js";

const getTextFromImage = async (imagePath: string) => {
    const worker = createWorker({
        logger: m => console.log(m), // Add logger here
    });

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    await worker.setParameters({
        tessedit_pageseg_mode: PSM.SPARSE_TEXT,
    });

    const { data: { text } } = await worker.recognize(imagePath);
    await worker.terminate();

    return text.trim().replace(/\n/g, " ");
}

export {
    getTextFromImage
}
