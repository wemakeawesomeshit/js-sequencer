#!/usr/bin/env python
# encoding: utf=8

import echonest.audio as audio

def main(input_filename):
    bar_list = get_bar_list(input_filename)
    
    # split_file_into_bars('Beat', bar_list)
    # split_file_into_bars('Bass', bar_list)
    # split_file_into_bars('Other Guitar', bar_list)
    # split_file_into_bars('Siren', bar_list)
    # split_file_into_bars('Synth', bar_list)
    # split_file_into_bars('Synth 2', bar_list)
    # split_file_into_bars('Keys', bar_list)
    split_file_into_bars('Rythm Guitar', bar_list)
    # split_file_into_bars('Voice', bar_list)
    

def get_bar_list(input_filename):
    audiofile = audio.LocalAudioFile(input_filename)
    return chunker(audiofile.analysis.bars, 4)

def split_file_into_bars(track_name, bar_list):
    i = 0
    for bars in bar_list:
        four_bar_chunk = audio.AudioQuantumList()
        for bar in bars:
            four_bar_chunk.append(bar)
        
        audiofile = audio.LocalAudioFile("music/tracks/"+track_name+".mp3")
        out = audio.getpieces(audiofile, four_bar_chunk)
        i = i + 1
        out.encode("music/output/"+track_name+"-chunk-"+str(i))

def chunker(seq, size):
    return (seq[pos:pos + size] for pos in xrange(0, len(seq), size))


if __name__ == '__main__':
    import sys
    try:
        input_filename = sys.argv[1]
    except:
        print "Nope."
        sys.exit(-1)
    main(input_filename)
