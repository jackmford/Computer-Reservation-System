import React from 'react';
import ReactDOM from 'react-dom';


class Test extends React.Component {
    render() {
        return (
            <div>Hello, Flask React.</div>
        );
    }
}

ReactDOM.render(<Test />, document.getElementById('content'));
