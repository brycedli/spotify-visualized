function onLogin(){
    var CLIENT_ID = '22ca38327ff8436cbf97e5979d2eb063';
    var REDIRECT_URI = 'http://localhost:3000'; 
    function getLoginURL(scopes) {
        return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
            '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
            '&scope=' + encodeURIComponent(scopes.join(' ')) +
            '&response_type=token';
    }
    var url = getLoginURL([
        'user-top-read'
    ])
    window.location = url;
}
export default function LoginPage(){
    return(
        <div>
            <button onClick={onLogin}>
                Connect spotify
            </button>
            <p>
                Login page
            </p>
        </div>
    )
}