import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Label } from '../../components/atoms/label/label';
import { Button } from '../../components/atoms/button/button';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, Label, Button],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {}