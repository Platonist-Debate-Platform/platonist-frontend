import React, { FC, useState } from "react";
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { GlobalState, PublicRequestKeys, availableLanguages, LocalizeDispatch, selectLanguage, AvailableLanguage} from "../../../Library";

interface LanguageProps{
    [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
    [PublicRequestKeys.Locals]: GlobalState[PublicRequestKeys.Locals];
}

export const LanguageBase: FC<LanguageProps> =  (props) => {
    const { locals } = props;
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    const changeLanguage = (lang: AvailableLanguage) => {
        dispatch(selectLanguage(lang.extendedCode));
    };
  
    const dispatch = useDispatch<LocalizeDispatch>();

    return((
        <Dropdown isOpen={dropdownOpen} toggle={toggle} size="md" className={'dd-language'} >
            <DropdownToggle caret className={"toggle"}>
                {locals.code}
            </DropdownToggle>
            <DropdownMenu>
                {
                    availableLanguages.map((lang) => {
                        return(
                            <DropdownItem onClick={e => changeLanguage(lang)}>{lang.name}</DropdownItem>
                        )
                    })
                }
            </DropdownMenu>
        </Dropdown>
    )
    || null);
}

export const Language = connect((state: GlobalState) => ({
    [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
    [PublicRequestKeys.Locals]: state[PublicRequestKeys.Locals],
}))(LanguageBase);

export default Language;