import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    public registerType = '';

    constructor( public route: ActivatedRoute) {
        this.route.params.subscribe( data => {
            this.registerType = data['type'];
        })
    }

    ngOnInit(): void {
    }

}
