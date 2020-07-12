export default {
    token: localStorage.getItem('token'),
    authenticated: false,
    loginError: '',
    signupError: [],
    name: '',
    user: {
        avatar: '',
        settings: {
            status: '',
            theme: 'classic',
            privacity: 'all'
        }
    }
}