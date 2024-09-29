export default function distanceFromHtmlElement(element, mouseX, mouseY) {
  const rect = element.getBoundingClientRect();
  const elementCenterX = rect.left + rect.width / 2;
  const elementCenterY = rect.top + rect.height / 2;

  // Calculate distance from mouse to element center
  const distanceX = mouseX - elementCenterX;
  const distanceY = mouseY - elementCenterY;

  // Use Pythagorean theorem to get distance
  return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
}
