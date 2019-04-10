module.exports = `
doctype html
html(lang='en' dir='ltr')
    head
        meta(charset='utf-8')
        meta(name='viewport' content='width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0')
        meta(http-equiv='X-UA-Compatible' content='ie=edge')
        link(rel='icon' type='image/x-icon' href='/favicon.ico')
        link(rel='shortcut icon' type='image/x-icon' href='/favicon.ico')
        title tabler.github.io - a responsive, flat and full featured admin template
        link(rel='stylesheet' href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300i,400,400i,500,500i,600,600i,700,700i&amp;subset=latin-ext')
        link(rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css')
        script(type='text/javascript' src='/js/require.min.js')
        script(type='text/javascript').
            requirejs.config({ baseUrl: '.' });
        link(rel='stylesheet' href='/css/dashboard.css')
        script(type='text/javascript' src='/js/dashboard.js')
    body
        h1 首页
`