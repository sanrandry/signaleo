import React from 'react';
import {
    IonContent,
    IonPage,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonChip, IonRefresherContent, IonRefresher, withIonLifeCycle
} from '@ionic/react';
import './Offre.css';
import Header from '../../components/Navigation/Header';
import {
    add,
    alarmOutline,
    ellipsisHorizontalOutline,
    location,
    phonePortraitOutline,
} from 'ionicons/icons';
import Axios from 'axios';
import HTTP_BASE_URL from '../../Constant/HttpConstant';
import img from "./assets/covoiturage.png";
import {RefresherEventDetail} from "@ionic/core";
import {Plugins} from "@capacitor/core";

const {Storage} = Plugins;

/**
 * Manage tabs zambaento
 */
class ZaMbaEnto extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            zambaento: [],
            user: '',
        };

        this.getData = this.getData.bind(this)
    }

    doRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
            this.getData();
            event.detail.complete();
        }, 2000);
    }

    onAddDemande = () => {
        this.props.history.push('/offreAdd');
    };

    /**
     * Get data from server
     */
    getData = () => {
        Axios.post(HTTP_BASE_URL + '/api/zambaento/list').then((data) => {
            if ((data.data.data.length !== 0) && (this.state.zambaento.length !== data.data.data.length)) {
                this.setState({
                    zambaento: data.data.data
                });
            }
        })
    };

    async getUser() {
        const ret = await Storage.get({key: 'user'});
        const user = JSON.parse(ret && ret.value ? ret.value : '{"user":null}');
        if (user.id) {
            this.setState({
                user: user
            });
        } else {
            this.props.history.push('/login');
        }
    }

    ionViewWillEnter() {
        this.getUser().then((res: any) => {
            this.getData();
        });
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        this.getData()
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <IonPage>
                <Header/>
                <IonContent>
                    <IonRefresher slot="fixed" onIonRefresh={(e) => this.doRefresh(e)}>
                        <IonRefresherContent/>
                    </IonRefresher>
                    {
                        this.state.zambaento.map((item: any) => {
                            return (
                                <IonItem key={item.id}>
                                    <img alt="profile" style={{width: "45px", height: "45px"}} src={img}/>
                                    <IonLabel>
                                        <h2>Mba ho
                                            ento {item.user ? (item.user.name ? item.user.name : 'Aho') : 'Aho'}</h2>
                                        <IonChip color="primary">
                                            <IonIcon icon={location} color="primary"/>
                                            <IonLabel>{item.depart}</IonLabel>&nbsp;
                                            <IonIcon icon={ellipsisHorizontalOutline}/>&nbsp;
                                            <IonIcon icon={location} color="success"/>
                                            <IonLabel>{item.arrive}</IonLabel>
                                        </IonChip>
                                        <p>
                                            <IonChip color="warning">
                                                <IonIcon icon={alarmOutline} color="dark"/>
                                                <IonLabel>{item.dateDepart.split('T')[0] + ' ' + item.dateDepart.split('T')[1].substring(0, 5)}</IonLabel>
                                            </IonChip>
                                        </p>
                                        <p>
                                            <IonChip color="warning">
                                                <IonIcon icon={phonePortraitOutline} color="dark"/>
                                                <IonLabel>{item.contact ? item.contact : 'Signaleo'}</IonLabel>
                                            </IonChip>
                                        </p>
                                    </IonLabel>
                                </IonItem>
                            )
                        })
                    }
                    <IonFab vertical="center" onClick={() => {
                        this.onAddDemande()
                    }} horizontal="end" slot="fixed">
                        <IonFabButton>
                            <IonIcon icon={add}/>
                        </IonFabButton>
                    </IonFab>
                </IonContent>
            </IonPage>
        );
    }
}

export default withIonLifeCycle(ZaMbaEnto);