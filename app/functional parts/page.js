import {PanelLeftPage} from './managePage';

export function Page(props) {
    let state = props.state;
    let store = props.store;
    return (
        (!state.settingsForSite && state.activeTabPageId > -1) ?
            <div id="manage-site">
                <PanelLeftPage state={state} store={store} />
            </div> : null
    )
}
