import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const Homepage = React.lazy(() => import('./routes/Homepage'));
const Error = React.lazy(() => import('./routes/Error'));

import './static/styles/index.scss';


const App = () => {
    return (
        <div className="app">
            <Router>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route exact path="/" component={Homepage} />
                        <Route component={Error} />
                    </Switch>
                </Suspense>
            </Router>
        </div>
    );
};

export default App
