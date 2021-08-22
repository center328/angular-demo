import { Component, OnInit } from '@angular/core';
import {FilesApi} from '../../api/files.api';
import {NumberModel} from '../../api/models/number.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  numbers: NumberModel[] = [];
  constructor(private filesApi: FilesApi, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.filesApi.getData().subscribe((data: NumberModel[]) => {
      if (data.length < 1) {
        this.snackBar.open('«Server Error»', 'close', {
          duration: 8000,
        });
      }
      this.numbers = data;
    });
  }

}
