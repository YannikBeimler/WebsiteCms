import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatContent',
  standalone: true
})
export class FormatContentPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';
    // Basic newline to br for now. Will be replaced by a markdown parser later.
    return value.replace(/\n/g, '<br/>');
  }
}
