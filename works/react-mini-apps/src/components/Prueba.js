// import React, { Component } from 'react';

// class Prueba extends Component {
//     state = { pepito: Math.random() }
//     componentDidMount() {
//         console.log('montado');
//         console.log(this.state);
//     }
//     componentDidUpdate() {
//         console.log('actualizado');
//         console.log(this.state);
//     }

//     componentWillUnmount() {
//         console.log('desmontado');
//         console.log(this.state);
//     }
//     render() {
//         return (
//             <div>
//                 <h3>Hola</h3>
//                 <button
//                     onClick={() => this.setState({pepito: Math.random()})}
//                 >CLICK</button>
//             </div>
//         );
//     }
// }

// export default Prueba;

import React, { useState, useEffect } from 'react';

const Prueba = () => {
    const [pepito, setPepito] = useState(Math.random());

    useEffect(() => {
        console.log('montado');
        console.log(pepito);
        return () => {
            console.log('desmontado');
            console.log(pepito);

        }
    }, []);
    useEffect(() => {
        console.log('actualizado');
        console.log(pepito);

    })

    return (
        <div>
            <h3>Hola</h3>
            <button
                onClick={() => setPepito(Math.random())}
            >CLICK</button>
        </div>
    );
}

export default Prueba;

