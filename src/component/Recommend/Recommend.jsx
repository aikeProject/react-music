import React, {Component} from 'react';
import './style.styl';
/******** 轮播组件 *******/
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css';
/******** end *******/
import {getCarousel, getRecommendList} from '@/api/recommendApi';
import {CODE_SUCCESS} from '@/api/config';
import {createAlbumByList} from '@/model/album';
// 公用组件
// 滑屏
import Scroll from '@/common/scroll/Scroll';

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderList: [],  // 轮播数据
            albumlibList: [], // 专辑列表
            refreshScroll: false, // 刷新滑动组件
        }
    }
    componentDidMount() {
        // ****** 初始化轮播插件 ******
        // 获取轮播数据
        getCarousel().then((res) => {
            // CODE_SUCCESS = 0 即请求成功
            if (res.code === CODE_SUCCESS) {
                const sliderList = res.data.slider;
                this.setState({
                    sliderList
                }, () => {
                    // 初始化一次
                    if (!this.sliderSwiper) {
                        this.sliderSwiper = new Swiper('.swiper-container', {
                            loop: true, // 无缝轮播
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false,
                            pagination: '.swiper-pagination', // 分页器
                        })
                    }
                })
            }
        });
        /* ******** end ******** */
        // 获取歌单推荐列表
        getRecommendList().then((res) => {
            if (res) {
                if (res.code === CODE_SUCCESS) {
                    const albumlibList = res.albumlib.data.list;
                    this.setState({
                        albumlibList
                    }, () => {
                        // 更新专辑列表后刷新
                        this.setState({
                            refreshScroll: true
                        })
                    });
                }
            }
        })
    }

    /* ******** 轮播 ******** */
    gotoLink(linkUrl) {
        // 使用闭包保存每一条链接
        return () => {
            window.location.href = linkUrl;
        }
    }
    swiper() {
        const sliderList = this.state.sliderList;
        return (
            sliderList.map((item, index) => {
                return (
                    <div className="swiper-slide" key={item.id}>
                        <a onClick={this.gotoLink(item.linkUrl)}>
                            <img src={item.picUrl} alt="music推荐" className={'swiper-img'}/>
                        </a>
                    </div>
                )
            })
        )
    }
    /* ********* end ******** */

    /********  专辑推荐列表  ********/
    albumList() {
        return this.state.albumlibList.map((value) => {
            let album = createAlbumByList(value);
            return (
                <div className={'album-wrapper'} key={album.id}>
                    <div className={'left'}>
                        <img src={album.img} alt={album.name}/>
                    </div>
                    <div className={'right'}>
                        <div className={'music-name'}>
                            {album.name}
                        </div>
                        <div className={'singer-name'}>
                            {album.singer}
                        </div>
                        <div className={'time'}>
                            {album.publicTime}
                        </div>
                    </div>
                </div>
            )
        });
    }
    /*************  end ************/
    render() {
        return (
            <div className={'recommend'}>
                <Scroll refresh={this.state.refreshScroll} >
                    <div className={'slider-container'}>
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                {
                                    this.swiper()
                                }
                            </div>
                            <div className="swiper-pagination selfColor"></div>
                        </div>
                    </div>
                    <div className={'album-container'}>
                        <h1 className={'title'}>专辑推荐</h1>
                        <div className={'album-list'}>
                            {
                                this.albumList()
                            }
                        </div>
                    </div>
                </Scroll>
            </div>
        )
    }
}

export default Recommend;