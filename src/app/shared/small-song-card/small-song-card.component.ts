import { Component, EventEmitter, input, Output } from '@angular/core';
import { ReadSong } from '../../services/model/song.model';

@Component({
  selector: 'app-small-song-card',
  imports: [],
  templateUrl: './small-song-card.component.html',
  styleUrl: './small-song-card.component.scss',
})
export class SmallSongCardComponent {
  song = input.required<ReadSong>();

  @Output() songToPlay$ = new EventEmitter<ReadSong>();

  play(): void {
    this.songToPlay$.next(this.song());
  }
}
