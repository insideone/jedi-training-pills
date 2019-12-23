import DiscussionPageUrl from "../../src/urls/discussionPageUrl";

test('DiscussionPageUrl.isFirst should return true for first page', () => {
    const page = new DiscussionPageUrl('https://steamcommunity.com/groups/JediTraining/discussions/0/1621724915786863635');
    expect(page.isFirst()).toBeTruthy();
    expect(page.getTo(1).isFirst()).toBeTruthy();
});

test('DiscussionPageUrl.isFirst should return false for non-first page', () => {
    const page = new DiscussionPageUrl('https://steamcommunity.com/groups/JediTraining/discussions/0/1621724915786863635?ctp=12');
    expect(page.isFirst()).toBeFalsy();
    expect(page.getTo(5).isFirst()).toBeFalsy();
});
