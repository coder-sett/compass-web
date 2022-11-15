import React, { useContext } from 'react';
import MenuTopicItem from './MenuTopicItem';
import MenuItem from './MenuItem';
import MenuSubItem from './MenuSubItem';
import { OrganizationsActivity, Organizations, Topic } from './config';
import NicheCreationIcon from './assets/NicheCreation.svg';
import { SideBarContext } from '@modules/analyze/context/SideBarContext';

const NicheCreation = () => {
  const { menuId, subMenuId } = useContext(SideBarContext);
  return (
    <MenuTopicItem
      hash={Topic.NicheCreation}
      icon={
        <span className="mr-1 flex-shrink-0">
          <NicheCreationIcon />
        </span>
      }
      menus={
        <>
          <MenuItem id="1" disabled>
            Developer Attraction
          </MenuItem>
          <MenuItem
            active={menuId === Organizations.Overview}
            id={Organizations.Overview}
            subMenu={
              <>
                {OrganizationsActivity.groups.map((item) => {
                  return (
                    <MenuSubItem
                      key={item.id}
                      active={item.id === subMenuId}
                      id={item.id}
                    >
                      {item.name}
                    </MenuSubItem>
                  );
                })}
              </>
            }
          >
            Organizations Activity
          </MenuItem>
          <MenuItem id="3" disabled>
            Technological Advancement
          </MenuItem>
        </>
      }
    >
      Niche Creation
    </MenuTopicItem>
  );
};

export default NicheCreation;
