import { Form, Head, usePage } from '@inertiajs/react';
import SocialMediaController from '@/actions/App/Http/Controllers/Settings/SocialMediaController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/social-media';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
    socialLinks: {
        instagram?: string;
        x?: string;
        tiktok?: string;
        youtube?: string;
        website?: string;
    };
};

export default function SocialMedia() {
    const { socialLinks } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Social Media settings" />

            <h1 className="sr-only">Social Media settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Social Media"
                    description="Update your social media links"
                />

                <Form
                    {...SocialMediaController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="instagram">Instagram URL</Label>

                                <Input
                                    id="instagram"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={socialLinks?.instagram ?? ''}
                                    name="instagram"
                                    placeholder="https://instagram.com/username"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.instagram}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="x">X URL</Label>

                                <Input
                                    id="x"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={socialLinks?.x ?? ''}
                                    name="x"
                                    placeholder="https://x.com/username"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.x}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tiktok">TikTok URL</Label>

                                <Input
                                    id="tiktok"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={socialLinks?.tiktok ?? ''}
                                    name="tiktok"
                                    placeholder="https://tiktok.com/@username"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.tiktok}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="youtube">YouTube URL</Label>

                                <Input
                                    id="youtube"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={socialLinks?.youtube ?? ''}
                                    name="youtube"
                                    placeholder="https://youtube.com/@username"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.youtube}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="website">Website URL</Label>

                                <Input
                                    id="website"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={socialLinks?.website ?? ''}
                                    name="website"
                                    placeholder="https://example.com"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.website}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

SocialMedia.layout = {
    breadcrumbs: [
        {
            title: 'Social Media settings',
            href: edit(),
        },
    ],
};
