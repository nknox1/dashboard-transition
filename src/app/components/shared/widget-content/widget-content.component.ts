import { Input } from '@angular/core';
import { WidgetID } from "app/models/widget.model";
import { BusyBoxMessageID } from 'app/models/busy-box.model';
import { EventService } from "app/services/event.service";
import { WidgetHeaderModel } from "app/models/widget-header.model";
import { SettingsSelectionModel } from "app/models/widget-settings.model";
import { Subscription } from "rxjs/Subscription";

export class WidgetContentComponent {
settingsSelections: SettingsSelectionModel;
subscription: Subscription;

    constructor(protected widgetID: WidgetID, protected _eventService: EventService) {
        
    }

    showBusyBox(id: BusyBoxMessageID){
        this._eventService.raiseShowBusyBox(id);

        if (this.widgetID !== WidgetID.pivotViewer)
            setTimeout(() => {
                this.hideBusyBox();
            }, 1000);
    }
    hideBusyBox() {
        this._eventService.raiseHideBusyBox();
    }
    updateHeader(header: WidgetHeaderModel) {
        this._eventService.raiseWidgetHeaderUpdated(header);
    }
}