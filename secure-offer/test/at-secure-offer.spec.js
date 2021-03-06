/* global adobe testOffer */

describe('greeter', function () {
  var offers;
  var maliciousHtml = '<b style=\\"color: red;\\" onclick=\\"alert(1)\\">hello</b>\
<div id=\\"1\\" style=\\"width: expression(alert(2));\\">1</div>\
<div id=\\"2\\" style=\\"background-image: url(javascript:alert(3))\\">2</div>\
<img src=\\"http://adobe.com/1.png\\"><a href=\\"javascript:alert(4)\\">\
<script src=\\"http://evilhost\\"><\\/script>';
  var sanitizedHtml = '<b style="color: red">hello</b><div id="1">1</div><div id="2">2</div><img src="http://adobe.com/1.png"><a></a>';

  it('should sanitize HTML offers', function () {
    testOffer = '[{"type":"html","content":"' + maliciousHtml + '"}]';

    adobe.target.ext.getSecureOffer({
      mbox: 'htmlTest',
      success: function (response) {
        offers = response;
      }
    });
    expect(offers[0].content).toEqual(sanitizedHtml);
  });

  it('should sanitize Action offers', function () {
    testOffer = '[{"type":"actions","content":[{"selector":"#aaa","cssSelector":"#aaa","content":"' +
    maliciousHtml + '","action":"setContent"},{"selector":"#bbb","cssSelector":"#bbb","content":"' +
    maliciousHtml + '","action":"prependContent"},{"selector":"#bbb","cssSelector":"#bbb","content":"' +
    maliciousHtml + '","action":"appendContent"},{"selector":"#bbb","cssSelector":"#bbb","content":"' +
    maliciousHtml + '","action":"replaceContent"}]}]';

    adobe.target.ext.getSecureOffer({
      mbox: 'htmlTest',
      success: function (response) {
        offers = response;
      }
    });
    offers[0].content
      .forEach(function (action) {
        expect(action.content).toEqual(sanitizedHtml);
      });
  });

  it('should sanitize multiple offers', function () {
    testOffer = '[{"type":"html","content":"' +
    maliciousHtml + '"},{"type":"html","content":"' + maliciousHtml + '"}]';

    adobe.target.ext.getSecureOffer({
      mbox: 'multiHtmlTest',
      success: function (response) {
        offers = response;
      }
    });
    offers
      .forEach(function (offer) {
        expect(offer.content).toEqual(sanitizedHtml);
      });
  });
});
