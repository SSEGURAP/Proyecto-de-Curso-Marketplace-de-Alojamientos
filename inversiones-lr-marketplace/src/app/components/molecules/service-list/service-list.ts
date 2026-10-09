import { Component, Input } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';

@Component({
  imports: [Badge],
  selector: 'app-service-list',
  styleUrl: './service-list.css',
  templateUrl: './service-list.html',
})
export class ServiceList {
  @Input() services: string[] = [];
}
