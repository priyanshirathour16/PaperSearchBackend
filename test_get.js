const http = require('http');

http.get('http://localhost:5000/api/manuscripts', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const json = JSON.parse(data);
            console.log('Count:', json.data.length);
            if (json.data.length > 0) {
                console.log('First Public ID:', json.data[0].manuscript_id);
                console.log('First Journal:', json.data[0].journal ? json.data[0].journal.title : 'None');
            }
        } catch (e) {
            console.log('Raw:', data);
        }
    });
}).on('error', (err) => {
    console.log('Error: ' + err.message);
});
