type QueryMakerContext = string | Element | Document;

class QueryMaker {
    from(data: QueryMakerContext): Element | Document {
        if (typeof data === 'string') {
            return (new DOMParser).parseFromString(data, 'text/html');
        }

        return data;
    }

    all(context: QueryMakerContext, selector: string): NodeListOf<Element> {
        return this.from(context).querySelectorAll(selector);
    }

    one(context: QueryMakerContext | string, selector: string): Element {
        const node = this.maybeOne(context, selector);
        if (node === null) {
            throw new Error(`Can't find ${this.describeQuery(context, selector)}`);
        }

        return node;
    }

    date(context: QueryMakerContext | string, selector: string, attributeName = 'data-timestamp'): Date {
        const node = this.one(context, selector);
        const date = this.createDate(node.getAttribute(attributeName));
        if (!date) {
            throw new Error(`Can't find timestamp ${this.describeQuery(context, `${selector}[${attributeName}]`)}`);
        }

        return date;
    }

    maybeDate(context: QueryMakerContext | string, selector: string, attributeName = 'data-timestamp'): Date | null {
        try {
            return this.date(context, selector, attributeName);
        } catch (e) {
            return null;
        }
    }

    createDate(attributeValue: string | null): Date | null {
        return attributeValue === null ? null : new Date(1000 * Number(attributeValue));
    }

    last(context: QueryMakerContext | string, selector: string): Element {
        const nodes = this.all(context, selector);
        if (nodes.length === 0) {
            throw new Error(`Can't find any of ${this.describeQuery(context, selector)}`);
        }

        return nodes[nodes.length - 1];
    }

    maybeOne(context: QueryMakerContext | string, selector: string): Element | null {
        return this.from(context).querySelector(selector);
    }

    describeQuery(context: QueryMakerContext | string, selector: string) {
        return `'${selector}' in '${this.describeContext(context)}'`;
    }

    describeContext(context: QueryMakerContext): string {
        if (typeof context === 'string' || context instanceof Document) {
            return 'document';
        }

        const path: string[] = [];

        let currentNode: Element | null = context;
        do {
            const classes = currentNode.className.split(' ').join('.');

            path.unshift([
                currentNode.nodeName.toLowerCase(),
                currentNode.id ? `#${currentNode.id}` : null,
                classes ? `.${classes}` : null,
            ].filter(part => !!part).join(''));
            currentNode = currentNode.parentNode as Element;
        } while (currentNode && currentNode.nodeName !== 'HTML');

        return path.join(' ');
    }

    previous(context: QueryMakerContext, confirmer: (element: Node) => boolean): Node {
        let currentNode: Node | null = this.from(context);

        while ((currentNode = currentNode.previousSibling)) {
            if (confirmer(currentNode)) {
                return currentNode;
            }
        }

        throw new Error(`Can't find ${this.describeQuery(context, 'previous')}`);
    }
}

const $ = new QueryMaker;

export default $;
