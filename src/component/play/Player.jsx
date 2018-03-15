/**
 * User: aike
 * Date: 2018/3/15 0015
 * Time: 21:03
 *
 */
import React,{Component} from 'react';
import './style.styl';
import Progress from './Progress/Progress';

class Player extends Component {
    render() {
        return (
            <div className={'player'}>
                <div>
                    <Progress progress={0}/>
                </div>
            </div>
        )
    }
}

export default Player;
