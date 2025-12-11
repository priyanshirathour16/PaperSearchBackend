const http = require('http');

const publicId = 'ef2f4165-4f4e-4f7f-a6fd-e1a5a8df2f36'; // Example ID from previous output (truncated in log but valid format for test if we use one from previous steps or just rely on list for now)
// Actually, let's fetch list then detail dynamically
http.get('http://localhost:5000/api/manuscripts', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        const list = JSON.parse(data);
        if (list.data && list.data.length > 0) {
            const id = list.data[0].manuscript_id;
            console.log('Fetching details for:', id);
            http.get('http://localhost:5000/api/manuscripts/' + id, (dRes) => {
                let dData = '';
                dRes.on('data', c => dData += c);
                dRes.on('end', () => {
                    console.log('Detail Status:', dRes.statusCode);
                    const detail = JSON.parse(dData);
                    // Check for authors
                    console.log('Authors count:', detail.data.authors ? detail.data.authors.length : 0);
                    console.log('Journal Title:', detail.data.journal ? detail.data.journal.title : 'None');
                });
            });
        }
    });
});
