export default text => {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
    }
    else {
        return new Promise((resolve, reject) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                return resolve();
            }
            catch(err) {
                return reject(err);
            }
            finally {
                document.body.removeChild(textArea);
            }
        })
    }
}