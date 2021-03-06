import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { SettingsMenuModel, SettingsMenuID, SettingsItemModel, SettingsSelectionID } from "app/models/widget-settings.model";
import { PanelBarItemModel } from "@progress/kendo-angular-layout/dist/es/main";
import { WidgetSettingsHelper } from "app/helpers/widget-settings.helper";
import { PivotReportID } from "app/models/pivot-viewer.model";
import { PivotViewerHelper } from "app/helpers/pivot-viewer.helper";
import { WidgetID } from "app/models/widget.model";
import { DetailColumnID } from "app/models/detail-column.model";
import { DetailColumnHelper } from "app/helpers/detail-column.helper";

@Injectable()
export class WidgetSettingsService
{
    constructor (private _http: Http) {}

    getMenuItems(widgetID: WidgetID, menuIDs: Array<SettingsMenuID>): Array<SettingsMenuModel> {
        var result: Array<SettingsMenuModel> = [];

        for(let menuID of menuIDs){
            result.push(this.buildSettingsMenu(widgetID, menuID));
        }
        return result;
    }

    private buildSettingsMenu(widgetID: WidgetID, menuID: SettingsMenuID) : SettingsMenuModel {
        let items = this.buildMenuItemContent(menuID);
        let name = WidgetSettingsHelper.getMenuTitle(menuID);
        let selectionType = WidgetSettingsHelper.getSelectionType(widgetID, menuID);
        let isVisible = WidgetSettingsHelper.getMenuVisibility(widgetID, menuID);

        if (selectionType == SettingsSelectionID.multiple)
            items.unshift(<SettingsItemModel> { displayName: "All", isAllItem: true });

        let menuItem = new SettingsMenuModel(name, menuID, selectionType, isVisible, items);
        if(menuItem.selectionID === SettingsSelectionID.singleRequired && menuID != SettingsMenuID.pivotViewerReport)
        {
            menuItem.items[0].isChecked = true;
            menuItem.setTitle();
        }

        return menuItem;
    }

    private buildMenuItemContent(menuType: SettingsMenuID) : Array<SettingsItemModel> {
        switch(menuType) {
            case SettingsMenuID.view:
                return this.buildSettingsItemsView();
            case SettingsMenuID.mission:
                return this.buildSettingsItemsMission();
            case SettingsMenuID.group:
                return this.buildSettingsItemsGroup();
            case SettingsMenuID.pivotViewerReport:
                return this.buildSettingsItemsPivotViewerReport();
            case SettingsMenuID.airForceMds:
                return this.buildSettingsItemsAirForceMds();
            case SettingsMenuID.imagery:
                return this.buildSettingsItemsImagery();
            case SettingsMenuID.tagConfig:
                return this.buildSettingsItemsTagConfig();
            case SettingsMenuID.detailColumn:
                return this.buildSettingsItemsDetailColumn();
            default:
                return null;
        }
    }

    private buildSettingsItemsView() : Array<SettingsItemModel> {
        return [
            <SettingsItemModel> { displayName: "View 1" },
            <SettingsItemModel> { displayName: "View 2" }
        ];
    }

    private buildSettingsItemsMission() : Array<SettingsItemModel> {
        return [
            <SettingsItemModel> { displayName: "ASW - Anti-Submarine Warfare", key: "ASW" },
            <SettingsItemModel> { displayName: "CCMRF - Southecom CCMRF", key: "CCMRF" },
            <SettingsItemModel> { displayName: "cORe - CORE", key: "cORe" },
            <SettingsItemModel> { displayName: "GWOT - Global War On Terror", key: "GWOT" },
        ];
    }

    private buildSettingsItemsGroup() : Array<SettingsItemModel> {
        return [
            <SettingsItemModel> { displayName: "NGB: E10 - Medical (247)", guidID: "F24B2341-8CEE-4796-A1DC-EAF7BBF23FEF" },
            <SettingsItemModel> { displayName: "NGB: E10 - Logistics (332)", guidID: "3AB884A9-89F6-4276-9ABC-D0FBDCC59346" },
            <SettingsItemModel> { displayName: "NGB: E10 - Engineering (302)", guidID: "EF0AD742-0A31-42FB-ADC0-A219A9637DBE" },
        ];
    }

    private buildSettingsItemsPivotViewerReport() : Array<SettingsItemModel> {
        return [
            <SettingsItemModel> { displayName: PivotViewerHelper.getReportName(PivotReportID.commandReadiness), numberID: PivotReportID.commandReadiness },
            <SettingsItemModel> { displayName: PivotViewerHelper.getReportName(PivotReportID.airForceAirAssets), numberID: PivotReportID.airForceAirAssets },
        ];
    }

    private buildSettingsItemsAirForceMds() : Array<SettingsItemModel> {
        return [
            <SettingsItemModel> { displayName: "A-10/A010A (87)", key: "A010A" },
            <SettingsItemModel> { displayName: "B-2/B002A (20)", key: "B002A" },
            <SettingsItemModel> { displayName: "C-130/C130J (104)", key: "C130J" },
            <SettingsItemModel> { displayName: "RC135/RC135W (12)", key: "RC135W" },
        ];
    }

    private buildSettingsItemsImagery() : Array<SettingsItemModel> {
        return [
            <SettingsItemModel> { displayName: "Terrain", key: "satellite" },
            <SettingsItemModel> { displayName: "Streets", key: "streets" }
            // <SettingsItemModel> { displayName: "Light Gray", key: "gray" },
            // <SettingsItemModel> { displayName: "Dark Gray", key: "dark-gray" },
            // <SettingsItemModel> { displayName: "Oceans", key: "oceans" },
            // <SettingsItemModel> { displayName: "National Geographic", key: "national-geographic" },
        ];
    }

    private buildSettingsItemsTagConfig() : Array<SettingsItemModel> {
        return [
            <SettingsItemModel> { displayName: "Test", guidID: "CA1A241F-A56C-4A7E-B30E-D97C1B0FD629" },
            <SettingsItemModel> { displayName: "My Configuration", guidID: "826009D7-8A05-4818-82A0-6B15F8B37A9D" }
        ];
    }

    private buildSettingsItemsDetailColumn() : Array<SettingsItemModel> {
        let model: SettingsItemModel[] = [];
        let defaultColumns = DetailColumnHelper.getDefaultColumns();

        for(let column in DetailColumnID) {
            let columnID = Number(column);
            if (!isNaN(columnID))
                model.push(<SettingsItemModel> 
                {
                     displayName: DetailColumnHelper.getColumnName(columnID), 
                     numberID: columnID, 
                     isChecked: defaultColumns.some(c => c === columnID)
                });
        }

        return model;
    }
}