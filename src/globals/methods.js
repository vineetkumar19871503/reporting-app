
const methods = {
    print: id => {
        try {
            var content = document.getElementById(id).innerHTML;
            var mywindow = window.open('', 'Print', 'height=600,width=800');
            mywindow.document.write('<html><head><title></title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(content);
            mywindow.document.write('</body></html>');
            mywindow.document.close();
            mywindow.focus();
            mywindow.print();
            mywindow.close();
            return true;
        } catch(e) {
            console.log(e.message);
            alert("Please allow Pop-up for priting the bill.")
        }
        
    },
    moneyToWords: amt => {
        return require('convert-rupees-into-words')(amt);
    }
}

export default methods;
