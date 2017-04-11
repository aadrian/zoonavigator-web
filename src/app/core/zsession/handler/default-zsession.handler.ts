/*
 * Copyright (C) 2017  Ľuboš Kozmon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Injectable} from "@angular/core";
import {ZSessionHandler} from "./zsession.handler";
import {ZSessionInfo} from "../zsession-info";
import {StorageService} from "../../../core";
import {ActivatedRoute, Router} from "@angular/router";
import {FeedbackService} from "../../feedback/feedback.service";

@Injectable()
export class DefaultZSessionHandler implements ZSessionHandler {

  private sessionInfoKey = "sessionInfo";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) {
  }

  onSessionInvalid(): void {
    this.router
      .navigate(
        ["/connect", {
          returnUrl: this.activatedRoute.snapshot.url
        }]
      )
      .then(() => this.sessionInfo = null);
  }

  get sessionInfo(): ZSessionInfo | null {
    const json = this.storageService.get(this.sessionInfoKey);

    if (json) {
      return JSON.parse(json);
    }
  }

  set sessionInfo(value: ZSessionInfo | null) {
    if (value) {
      this.storageService.set(this.sessionInfoKey, JSON.stringify(value));

      return;
    }

    this.storageService.remove(this.sessionInfoKey);
  }
}