using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHotel360.PublicWeb
{
    public class ExceptionGenerator
    {
        static readonly Action[] _ExceptionGenerators = { ThrowDivideByZeroException, ThrowOverflowException, ThrowNullReferenceException, ThrowArgumentOutOfRangeExceptionException };

        static readonly Random _Randomizer = new Random();

        public static void GenerateException()
        {
            var index = _Randomizer.Next(_ExceptionGenerators.Length);
            _ExceptionGenerators[index]();
        }

        private static void ThrowDivideByZeroException()
        {
            var zero = 0;
            var nonzero = 4;

            var wrongCalculation = nonzero / zero;
        }

        private static void ThrowOverflowException()
        {
            decimal bigDecimal = (decimal)int.MaxValue + 5;

            int exceededInteger = (int)bigDecimal;
        }

        private static void ThrowNullReferenceException()
        {
            string nullVariable = null;

            nullVariable.ToUpperInvariant();
        }

        private static void ThrowArgumentOutOfRangeExceptionException()
        {
            List<Char> characters = new List<Char>();
            characters.InsertRange(0, new Char[] { 'a', 'b', 'c', 'd', 'e', 'f' });
            for (int ctr = 0; ctr <= characters.Count; ctr++)
                Console.Write("'{0}'    ", characters[ctr]);
        }
    }
}
