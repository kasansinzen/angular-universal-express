import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.scss']
})
export class BlogEditComponent implements OnInit {

  blogId: number | string;

  constructor(
    private route: ActivatedRoute
  ) {
    this.blogId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

}
