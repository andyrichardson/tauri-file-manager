#[derive(Debug, Clone)]
enum Kind {
  FILE,
  DIRECTORY,
}

#[derive(Debug, Clone)]
struct Node<'a> {
  kind: Kind,
  name: &'a str,
}

fn test_fn<'a>() -> Node<'a> {
  let f = Node {
    kind: Kind::FILE,
    name: "Test",
  };
  return f;
}

fn main() {
  let t = test_fn();
  println!("{:?}", t);
}
