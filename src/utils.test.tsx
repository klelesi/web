import {expect, test} from 'vitest'
import {getNumberOfCommentsText, isCurrentUserAuthor} from "@/utils";
import {Auth, Post} from "@/interfaces";

test('Utils: get number of comments text', () => {
    expect(getNumberOfCommentsText(0)).equals('0 komentarjev');
    expect(getNumberOfCommentsText(1)).equals('1 komentar');
    expect(getNumberOfCommentsText(2)).equals('2 komentarja');
    expect(getNumberOfCommentsText(3)).equals('3 komentarji');
    expect(getNumberOfCommentsText(4)).equals('4 komentarji');
    expect(getNumberOfCommentsText(5)).equals('5 komentarjev');
    expect(getNumberOfCommentsText(10)).equals('10 komentarjev');
    expect(getNumberOfCommentsText(101)).equals('101 komentar');
    expect(getNumberOfCommentsText(102)).equals('102 komentarja');
    expect(getNumberOfCommentsText(103)).equals('103 komentarji');
    expect(getNumberOfCommentsText(1000)).equals('1000 komentarjev');
    expect(getNumberOfCommentsText(1001)).equals('1001 komentar');
    expect(getNumberOfCommentsText(84512)).equals('84512 komentarjev');
})

test('Utils: is current user author', () => {
    const auth1: Auth = {id: '12345', email: 'john.doe@example.com', name: 'John Doe'};
    const auth2: Auth = {id: '54121', email: 'jane.doe@example.com', name: 'Jane Doe'};
    const post: Post = {author: auth1} as Post;

    expect(isCurrentUserAuthor(auth1, post)).equals(true);
    expect(isCurrentUserAuthor(auth2, post)).equals(false);
    expect(isCurrentUserAuthor(null, post)).equals(false);
})