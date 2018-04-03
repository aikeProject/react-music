import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import './style.styl';
import {getRankgingList} from '@/api/ranking';
import {CODE_SUCCESS} from '@/api/config';
import {createRankingByList} from '@/model/ranking';
// 图片懒加载
import LazyLoad, {forceCheck} from 'react-lazyload';
import Loading from '@/common/loading/Loading';
import Scroll from '@/common/scroll/Scroll';
import RankingDetail from './rankingDetail/rankingDetail';

class Ranking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            rankingList: [],
            refreshScroll: false
        }
    }

    componentDidMount() {
        // 获取排行榜列表数据
        getRankgingList().then((res) => {
            if (res) {
                if (res.code === CODE_SUCCESS) {
                    // 过滤掉mv
                    const topList = [];
                    res.data.topList.forEach((item) => {
                        if (/MV/i.test(item)) {
                            return;
                        }
                        topList.push(createRankingByList(item));
                    });
                    this.setState({
                        loading: false,
                        rankingList: topList,
                    }, () => {
                        this.setState({
                            refreshScroll: true
                        });
                    })
                }
            }
        });
    }
    // 跳转到详情页
    goDetail(url) {
        return () => {
            this.props.history.push({
                pathname: url
            });
        }
    }
    render() {
        const {match} = this.props;
        return (
            <div className={'music-ranking'}>
                <Scroll refresh={this.state.refreshScroll} onScroll={() => {
                    forceCheck();
                }}>
                    <div className={'ranking-list'}>
                        {
                            this.state.rankingList.map((ranking, index) => (
                                <div className={'ranking-wrapper'} key={ranking.id}
                                onClick={this.goDetail(`${match.url}/${ranking.id}`)}>
                                    <div className={'left'}>
                                        <LazyLoad>
                                            <img src={ranking.img} alt={ranking.title}/>
                                        </LazyLoad>
                                    </div>
                                    <div className={'right'}>
                                        <div className={'ranking-title beyond-the-hidden'}>{ranking.title}</div>
                                        {
                                            ranking.songs.map((song, index) => {
                                                return (
                                                    <div className={'top-song beyond-the-hidden'} key={index}>
                                                        <span className={'index'}>{index + 1}</span>
                                                        <span className={'name'}>{song.songname}</span>
                                                        <span className={'song'}>{song.singername}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Scroll>
                <Route path={`${match.url}/:id`} component={RankingDetail}/>
                <Loading loading={this.state.loading}/>
            </div>
        )
    }
}

export default Ranking;
