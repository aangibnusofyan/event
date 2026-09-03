import React, { useEffect, useRef, useState } from 'react';
import {
    Baseline,
    Bold,
    Code,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Palette,
    Quote,
    Redo,
    RemoveFormatting,
    Strikethrough,
    Underline,
    Undo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
    disabled?: boolean;
}

const PRESET_COLORS = [
    { label: 'Teks Gelap Default', color: '#1f2937' },
    { label: 'Biru Navy (Tema Utama)', color: '#1B3A5C' },
    { label: 'Terracotta / Oranye (Aksen)', color: '#C1502E' },
    { label: 'Hijau Emerald', color: '#16a34a' },
    { label: 'Biru Terang', color: '#2563eb' },
    { label: 'Emas / Amber', color: '#d97706' },
    { label: 'Ungu / Violet', color: '#7c3aed' },
    { label: 'Merah Terang', color: '#dc2626' },
    { label: 'Abu-abu', color: '#6b7280' },
    { label: 'Cokelat Sand', color: '#8C6538' },
];

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Tuliskan deskripsi lengkap acara di sini...',
    className,
    minHeight = '220px',
    disabled = false,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const colorPickerContainerRef = useRef<HTMLDivElement>(null);
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState('#1B3A5C');

    // Close color picker on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                colorPickerContainerRef.current &&
                !colorPickerContainerRef.current.contains(event.target as Node)
            ) {
                setShowColorPicker(false);
            }
        };

        if (showColorPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPicker]);

    // Sync initial and external value into contentEditable without breaking cursor position
    useEffect(() => {
        if (editorRef.current && !isSourceMode) {
            if (editorRef.current.innerHTML !== (value || '')) {
                editorRef.current.innerHTML = value || '';
            }
            updateCounts(editorRef.current.innerText || '');
        }
    }, [value, isSourceMode]);

    const updateCounts = (text: string) => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        setWordCount(words);
    };

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            onChange(html === '<br>' ? '' : html);
            updateCounts(editorRef.current.innerText || '');
        }
    };

    const executeCommand = (command: string, value: string | undefined = undefined) => {
        if (disabled || isSourceMode) return;
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
            handleInput();
        }
    };

    const handleApplyColor = (color: string) => {
        setCurrentColor(color);
        executeCommand('foreColor', color);
        setShowColorPicker(false);
    };

    const handleInsertLink = () => {
        if (disabled || isSourceMode) return;
        const currentUrl = '';
        const url = prompt('Masukkan URL tautan (contoh: https://contoh.com):', currentUrl);
        if (url) {
            const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
            executeCommand('createLink', formattedUrl);
        }
    };

    const handleFormatBlock = (tag: string) => {
        executeCommand('formatBlock', `<${tag}>`);
    };

    return (
        <div
            className={cn(
                'rounded-lg border border-neutral-200 bg-white transition-all dark:border-neutral-800 dark:bg-neutral-950 focus-within:ring-1 focus-within:ring-neutral-950 dark:focus-within:ring-neutral-300',
                disabled && 'opacity-60 pointer-events-none',
                className
            )}
        >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50/70 p-1.5 dark:border-neutral-800 dark:bg-neutral-900/60">
                {/* Undo / Redo */}
                <div className="flex items-center gap-0.5 border-r border-neutral-200 pr-1 mr-1 dark:border-neutral-800">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => executeCommand('undo')}
                        disabled={disabled || isSourceMode}
                        title="Urungkan (Undo)"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <Undo className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => executeCommand('redo')}
                        disabled={disabled || isSourceMode}
                        title="Ulangi (Redo)"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <Redo className="size-3.5" />
                    </Button>
                </div>

                {/* Headings */}
                <div className="flex items-center gap-0.5 border-r border-neutral-200 pr-1 mr-1 dark:border-neutral-800">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFormatBlock('h2')}
                        disabled={disabled || isSourceMode}
                        title="Judul Besar (Heading 2)"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <Heading2 className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFormatBlock('h3')}
                        disabled={disabled || isSourceMode}
                        title="Sub Judul (Heading 3)"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <Heading3 className="size-3.5" />
                    </Button>
                </div>

                {/* Text Styles: Bold, Italic, Underline, Strikethrough */}
                <div className="flex items-center gap-0.5 border-r border-neutral-200 pr-1 mr-1 dark:border-neutral-800">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => executeCommand('bold')}
                        disabled={disabled || isSourceMode}
                        title="Tebal (Bold) - Ctrl+B"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 font-bold"
                    >
                        <Bold className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => executeCommand('italic')}
                        disabled={disabled || isSourceMode}
                        title="Miring (Italic) - Ctrl+I"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 italic"
                    >
                        <Italic className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => executeCommand('underline')}
                        disabled={disabled || isSourceMode}
                        title="Garis Bawah (Underline) - Ctrl+U"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 underline"
                    >
                        <Underline className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => executeCommand('strikeThrough')}
                        disabled={disabled || isSourceMode}
                        title="Coret (Strikethrough)"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 line-through"
                    >
                        <Strikethrough className="size-3.5" />
                    </Button>
                </div>

                {/* Text Color Picker */}
                <div ref={colorPickerContainerRef} className="relative flex items-center border-r border-neutral-200 pr-1 mr-1 dark:border-neutral-800">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        disabled={disabled || isSourceMode}
                        title="Ubah Warna Teks"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex flex-col items-center justify-center p-0 gap-0.5"
                    >
                        <Baseline className="size-3.5" />
                        <span
                            className="h-0.5 w-3.5 rounded-full"
                            style={{ backgroundColor: currentColor }}
                        />
                    </Button>

                    {showColorPicker && (
                        <div
                            className="absolute top-full left-0 z-50 mt-1.5 w-52 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 animate-in fade-in-0 zoom-in-95"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                                Pilihan Warna Teks
                            </p>
                            <div className="grid grid-cols-5 gap-1.5 mb-3">
                                {PRESET_COLORS.map((item) => (
                                    <button
                                        key={item.color}
                                        type="button"
                                        onClick={() => handleApplyColor(item.color)}
                                        title={item.label}
                                        className="size-6 rounded-md border border-neutral-200 dark:border-neutral-700 transition-transform hover:scale-115 focus:outline-none hover:ring-2 hover:ring-neutral-400"
                                        style={{ backgroundColor: item.color }}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center justify-between border-t border-neutral-100 pt-2 dark:border-neutral-800">
                                <label className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer font-medium hover:text-neutral-950">
                                    <input
                                        type="color"
                                        value={currentColor}
                                        onChange={(e) => handleApplyColor(e.target.value)}
                                        className="size-5 rounded border border-neutral-300 cursor-pointer p-0 bg-transparent"
                                    />
                                    <span>Pilih Kustom</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => handleApplyColor('#1f2937')}
                                    className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lists & Quote */}
                <div className="flex items-center gap-0.5 border-r border-neutral-200 pr-1 mr-1 dark:border-neutral-800">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => executeCommand('insertUnorderedList')}
                        disabled={disabled || isSourceMode}
                        title="Daftar Poin (Bullet List)"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <List className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => executeCommand('insertOrderedList')}
                        disabled={disabled || isSourceMode}
                        title="Daftar Angka (Numbered List)"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <ListOrdered className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFormatBlock('blockquote')}
                        disabled={disabled || isSourceMode}
                        title="Kutipan (Blockquote)"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <Quote className="size-3.5" />
                    </Button>
                </div>

                {/* Link & Clear Format */}
                <div className="flex items-center gap-0.5">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleInsertLink}
                        disabled={disabled || isSourceMode}
                        title="Sisipkan Tautan (Link)"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <LinkIcon className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => executeCommand('removeFormat')}
                        disabled={disabled || isSourceMode}
                        title="Hapus Format (Clear Formatting)"
                        className="size-7 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <RemoveFormatting className="size-3.5" />
                    </Button>
                </div>

                {/* Source View Toggle */}
                <div className="ml-auto flex items-center">
                    <Button
                        type="button"
                        variant={isSourceMode ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setIsSourceMode(!isSourceMode)}
                        title={isSourceMode ? 'Kembali ke Tampilan Visual' : 'Lihat Kode HTML (Source View)'}
                        className="h-7 px-2 text-xs gap-1.5 text-neutral-600 dark:text-neutral-300"
                    >
                        <Code className="size-3" />
                        <span>{isSourceMode ? 'Visual' : 'HTML'}</span>
                    </Button>
                </div>
            </div>

            {/* Editable Content Area */}
            {isSourceMode ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    style={{ minHeight }}
                    className="w-full p-4 font-mono text-xs text-neutral-800 bg-neutral-900/5 dark:bg-neutral-950 dark:text-neutral-200 focus:outline-none resize-y"
                    placeholder="<p>Tulis kode HTML di sini...</p>"
                />
            ) : (
                <div
                    ref={editorRef}
                    contentEditable={!disabled}
                    onInput={handleInput}
                    style={{ minHeight }}
                    data-placeholder={placeholder}
                    className={cn(
                        'w-full p-4 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none overflow-y-auto leading-relaxed',
                        'empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-400 empty:before:pointer-events-none',
                        // Prose styling for rich text inside editor
                        '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-neutral-900 dark:[&_h2]:text-neutral-100',
                        '[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-neutral-900 dark:[&_h3]:text-neutral-100',
                        '[&_p]:mb-2.5',
                        '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:space-y-1',
                        '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:space-y-1',
                        '[&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 dark:[&_blockquote]:border-neutral-700 [&_blockquote]:pl-3.5 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-neutral-600 dark:[&_blockquote]:text-neutral-400',
                        '[&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2'
                    )}
                />
            )}

            {/* Footer Status */}
            <div className="flex items-center justify-between border-t border-neutral-100 px-3 py-1.5 text-[11px] text-neutral-400 dark:border-neutral-800/80">
                <span>Gunakan toolbar untuk memformat teks (tebal, miring, poin, judul, link)</span>
                <span>{wordCount} kata</span>
            </div>
        </div>
    );
}
