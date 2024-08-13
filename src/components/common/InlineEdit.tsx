import React, { FC, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';

interface InlineEditProps {
    initialValue: string;
    setEditingName: (value: ((prevState: boolean) => boolean) | boolean) => void;
    updateValue: (value: string) => void;
}

export const InlineEdit: FC<InlineEditProps> = (props) => {
    const [name, setName] = useState(props.initialValue);

    return (
        <div className="flex">
            <label htmlFor="name" className="sr-only">
                Name
            </label>
            <input
                id="name"
                name="name"
                type="name"
                value={name}
                className="block w-full rounded-md border-0 pl-2.5 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onInput={(e) => {
                    return setName(e.currentTarget.value);
                }}
            />
            <button
                type="button"
                className="p-1 text-gray-500 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                    props.updateValue(name);
                    props.setEditingName(false);
                }}
            >
                <IconCheck aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
                type="button"
                className="p-1 text-gray-500 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                    props.setEditingName(false);
                }}
            >
                <IconX aria-hidden="true" className="h-5 w-5" />
            </button>
        </div>
    );
};